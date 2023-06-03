import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";
import { Wallet } from "../common/database/entities/wallet.entity";
import { Transaction } from "../common/database/entities/transaction.entity";
import { ChartElement } from "./wallet.dtos";

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Transaction)
    private _transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private _walletRepository: Repository<Wallet>,
  ) {}

  async getWalletByTransactionId(transactionId: number): Promise<Wallet> {
    /* 현재 interval에 해당하는 transaction이면 wallets에 추가 */
    const wallet = await this._walletRepository
      .createQueryBuilder("wallet")
      .leftJoinAndSelect("wallet.transaction", "transaction")
      .where("transaction.id = :transactionId", { transactionId })
      .getOne();

    return wallet;
  }

  async getChart(intervalTimestamp: number, startTimestamp?: number): Promise<ChartElement[]> {
    const response: ChartElement[] = [];

    /* timestamp: genensis block */
    let currentStartTimestamp = startTimestamp ? startTimestamp : 1438269973;
    let currentEndTimestamp = intervalTimestamp;

    while (currentEndTimestamp <= Date.now()) {
      const query = this._walletRepository
        .createQueryBuilder("wallet")
        .innerJoinAndSelect("wallet.transaction", "transaction")
        .where("transaction.timestamp >= :startTimestamp", {
          startTimestamp: currentStartTimestamp,
        })
        .andWhere("transaction.timestamp < :endTimestamp", {
          endTimestamp: currentEndTimestamp,
        });

      const wallets: Wallet[] = await query.getMany();

      const newWallets: Wallet[] = [];
      for (const wallet of wallets) {
        const hasPreviousTransaction = await this._transactionRepository.findOne({
          where: {
            walletId: wallet.id,
            timestamp: LessThan(currentStartTimestamp),
          },
        });

        if (!hasPreviousTransaction) {
          newWallets.push(wallet);
        }
      }

      response.push({
        startTimestamp: currentStartTimestamp,
        endTimestamp: currentEndTimestamp,
        wallets,
        newWallets,
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
    const startIndex = chart.findIndex((data) => data.startTimestamp >= indexStartTimestamp);
    const endIndex = chart.findIndex((data) => data.endTimestamp <= indexEndTimestamp);

    const slicedWalletsByIndex = chart.slice(startIndex, endIndex);
    return slicedWalletsByIndex;
  }

  getWalletGrowthRate(chart: ChartElement[], indexStartTimestamp: number, indexEndTimestamp: number): number {
    const lastChart = this._sliceWalletsByIndex(chart, indexStartTimestamp, indexEndTimestamp);

    const firstInterval = lastChart[0];
    const lastInterval = lastChart[lastChart.length - 1];
    const initialCount = firstInterval.newWallets.length;
    const finalCount = lastInterval.newWallets.length;

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
