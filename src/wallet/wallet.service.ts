import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";
import { Wallet } from "../common/database/entities/wallet.entity";
import { Transaction } from "../common/database/entities/transaction.entity";
import { ChartElement } from "./wallet.dtos";
import { NewData } from "src/app.dtos";

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Transaction)
    private _transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private _walletRepository: Repository<Wallet>,
  ) {}

  async getChart(protocolAddress: string, intervalTimestamp: number, startTimestamp?: number): Promise<ChartElement[]> {
    const response: ChartElement[] = [];

    /* timestamp: genensis block */
    let currentStartTimestamp = startTimestamp ? startTimestamp : 1438269973;
    let currentEndTimestamp = currentStartTimestamp + intervalTimestamp;
    const endTimestamp = Math.floor(Date.now() / 1000);

    while (currentEndTimestamp <= endTimestamp) {
      const query = this._walletRepository
        .createQueryBuilder("wallet")
        .leftJoinAndSelect("wallet.transactions", "transaction")
        .leftJoinAndSelect("transaction.protocol", "protocol")
        .where("protocol.protocolAddress = :protocolAddress", {
          protocolAddress,
        })
        .andWhere("transaction.timestamp >= :startTimestamp", {
          startTimestamp: currentStartTimestamp,
        })
        .andWhere("transaction.timestamp < :endTimestamp", {
          endTimestamp: currentEndTimestamp,
        });

      const wallets: Wallet[] = await query.getMany();

      const newWallets: Wallet[] = [];
      let newWalletCumulativeNum = response.length ? response[response.length - 1].newWalletCumulativeNum : 0;

      for (const wallet of wallets) {
        const hasPreviousTransaction = await this._transactionRepository.findOne({
          where: {
            walletId: wallet.id,
            timestamp: LessThan(currentStartTimestamp),
          },
        });

        if (!hasPreviousTransaction) {
          newWallets.push(wallet);
          newWalletCumulativeNum++;
        }
      }

      response.push({
        startTimestamp: currentStartTimestamp,
        endTimestamp: currentEndTimestamp,
        wallets,
        newWallets,
        newWalletCumulativeNum,
      });

      currentStartTimestamp = currentEndTimestamp;
      currentEndTimestamp += intervalTimestamp;
    }

    return response;
  }

  private _sliceWalletsByIndex(
    chart: ChartElement[],
    indexStartTimestamp: number,
    indexEndTimestamp: number,
  ): ChartElement[] {
    const slicedWalletsByIndex = chart.filter(
      (data) => data.startTimestamp >= indexStartTimestamp && data.endTimestamp <= indexEndTimestamp,
    );
    return slicedWalletsByIndex;
  }

  getNewWallet(chart: ChartElement[], num: number) {
    const newWallet = [];
    let cnt = num,
      currentIndex = chart.length - 1;

    while (cnt > 0 && currentIndex >= 0) {
      for (const wallet of chart[currentIndex].newWallets) {
        newWallet.push({
          address: wallet.walletAddress,
          timestamp: new Date(wallet.transactions[wallet.transactions.length - 1].timestamp * 1000),
        });

        if (--cnt === 0) {
          break;
        }
      }

      currentIndex--;
    }

    return newWallet;
  }

  getWalletGrowthRate(chart: ChartElement[], indexStartTimestamp: number, indexEndTimestamp: number): number {
    const lastChart = this._sliceWalletsByIndex(chart, indexStartTimestamp, indexEndTimestamp);

    const firstInterval = lastChart[0];
    const lastInterval = lastChart[lastChart.length - 1];
    const initialCount = firstInterval.newWalletCumulativeNum;
    const finalCount = lastInterval.newWalletCumulativeNum;

    if (initialCount === 0) {
      return 0;
    }

    return ((finalCount - initialCount) / initialCount) * 100;
  }

  getActiveWalletCount(chart: ChartElement[], indexStartTimestamp: number, indexEndTimestamp: number): number {
    const lastChart = this._sliceWalletsByIndex(chart, indexStartTimestamp, indexEndTimestamp);

    const count = lastChart.reduce((count, walletsInterval) => count + walletsInterval.wallets.length, 0);
    return count;
  }
}
