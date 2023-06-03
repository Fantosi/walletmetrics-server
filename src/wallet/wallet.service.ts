import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";
import { Wallet } from "../common/database/entities/wallet.entity";
import { Transaction } from "../common/database/entities/transaction.entity";
import { WalletsByTimestampInterval } from "./wallet.dtos";

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

  async getWalletsByInterval(
    intervalTimestamp: number,
    startTimestamp?: number,
  ): Promise<WalletsByTimestampInterval[]> {
    const response: WalletsByTimestampInterval[] = [];

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

  async getNewWalletGrowthRate(intervalTimestamp: number): Promise<number[]> {
    const endTimestamp = Date.now();
    const startTimestamp1Day = endTimestamp - intervalTimestamp * 24 * 60 * 60 * 1000; // 1일 전
    const startTimestamp7Days = endTimestamp - intervalTimestamp * 7 * 24 * 60 * 60 * 1000; // 7일 전
    const startTimestamp30Days = endTimestamp - intervalTimestamp * 30 * 24 * 60 * 60 * 1000; // 30일 전

    const newWallets1Day = await this.getWalletsByInterval(intervalTimestamp, startTimestamp1Day);
    const newWallets7Days = await this.getWalletsByInterval(intervalTimestamp, startTimestamp7Days);
    const newWallets30Days = await this.getWalletsByInterval(intervalTimestamp, startTimestamp30Days);

    const growthRate1Day = this.calculateGrowthRate(newWallets1Day);
    const growthRate7Days = this.calculateGrowthRate(newWallets7Days);
    const growthRate30Days = this.calculateGrowthRate(newWallets30Days);

    return [growthRate1Day, growthRate7Days, growthRate30Days];
  }

  async getCurrentActiveWalletsCount(): Promise<number[]> {
    const endTimestamp = Date.now();
    const startTimestampToday = new Date().setHours(0, 0, 0, 0); // 오늘 자정
    const startTimestampThisWeek = endTimestamp - 7 * 24 * 60 * 60 * 1000; // 이번 주 첫날 자정
    const startTimestampThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(); // 이번 달 1일 자정

    const walletsToday = await this.getWalletsByInterval(startTimestampToday, endTimestamp);
    const walletsThisWeek = await this.getWalletsByInterval(startTimestampThisWeek, endTimestamp);
    const walletsThisMonth = await this.getWalletsByInterval(startTimestampThisMonth, endTimestamp);

    const countToday = walletsToday.reduce((count, walletsInterval) => count + walletsInterval.wallets.length, 0);
    const countThisWeek = walletsThisWeek.reduce((count, walletsInterval) => count + walletsInterval.wallets.length, 0);
    const countThisMonth = walletsThisMonth.reduce(
      (count, walletsInterval) => count + walletsInterval.wallets.length,
      0,
    );

    return [countToday, countThisWeek, countThisMonth];
  }

  private calculateGrowthRate(walletsIntervals: WalletsByTimestampInterval[]): number {
    const firstInterval = walletsIntervals[0];
    const lastInterval = walletsIntervals[walletsIntervals.length - 1];
    const initialCount = firstInterval.newWallets.length;
    const finalCount = lastInterval.newWallets.length;

    if (initialCount === 0) {
      return 0;
    }

    return ((finalCount - initialCount) / initialCount) * 100;
  }
}
