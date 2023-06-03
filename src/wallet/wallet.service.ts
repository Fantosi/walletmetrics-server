import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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

  async getWalletsByTimestampInterval(interval: number): Promise<WalletsByTimestampInterval[]> {
    /* transaction을 오름차순으로 정렬 */
    const transactions = await this._transactionRepository.find({ order: { timestamp: "ASC" } });

    const walletTimestamps: WalletsByTimestampInterval[] = [];

    let currentIntervalStart = transactions[0].timestamp;
    let currentIntervalEnd = currentIntervalStart + interval;

    let currentWallets: Wallet[] = [];

    for (const transaction of transactions) {
      if (transaction.timestamp >= currentIntervalStart && transaction.timestamp < currentIntervalEnd) {
        /* 현재 interval에 해당하는 transaction이면 wallets에 추가 */
        const wallet = await this.getWalletByTransactionId(transaction.id);

        if (wallet) {
          currentWallets.push(wallet);
        }
      } else {
        /* 현재 interval이 끝났으므로 결과에 추가하고 다음 interval로 넘어감 */
        walletTimestamps.push({
          startTimestamp: currentIntervalStart,
          endTimestamp: currentIntervalEnd,
          wallet: currentWallets,
        });

        currentIntervalStart = currentIntervalEnd;
        currentIntervalEnd = currentIntervalStart + interval;

        currentWallets = [];

        /* 현재 interval에 해당하는 transaction도 현재 wallets에 추가 */
        const wallet = await this.getWalletByTransactionId(transaction.id);

        if (wallet) {
          currentWallets.push(wallet);
        }
      }
    }

    /* 마지막 interval 결과 추가 */
    walletTimestamps.push({
      startTimestamp: currentIntervalStart,
      endTimestamp: currentIntervalEnd,
      wallet: currentWallets,
    });

    return walletTimestamps;
  }

  async getDailyWalletCounts(): Promise<{ date: string; count: number }[]> {
    const interval = 24 * 60 * 60 * 1000; // 1일을 밀리초로 표현
    const walletsByInterval = await this.getWalletsByTimestampInterval(interval);

    const dailyCounts: { date: string; count: number }[] = [];

    for (const wallets of walletsByInterval) {
      const startDate = new Date(wallets.startTimestamp).toISOString().split("T")[0];
      const endDate = new Date(wallets.endTimestamp).toISOString().split("T")[0];
      const count = wallets.wallet.length;

      dailyCounts.push({ date: startDate, count });
    }

    return dailyCounts;
  }

  async getWeeklyWalletCounts(): Promise<{ startDate: string; endDate: string; count: number }[]> {
    const interval = 7 * 24 * 60 * 60 * 1000; // 1주일을 밀리초로 표현
    const walletsByInterval = await this.getWalletsByTimestampInterval(interval);

    const weeklyCounts: { startDate: string; endDate: string; count: number }[] = [];

    for (const wallets of walletsByInterval) {
      const startDate = new Date(wallets.startTimestamp).toISOString().split("T")[0];
      const endDate = new Date(wallets.endTimestamp).toISOString().split("T")[0];
      const count = wallets.wallet.length;

      weeklyCounts.push({ startDate, endDate, count });
    }

    return weeklyCounts;
  }

  async getMonthlyWalletCounts(): Promise<{ year: number; month: number; count: number }[]> {
    const interval = 30 * 24 * 60 * 60 * 1000; // 30일을 밀리초로 표현
    const walletsByInterval = await this.getWalletsByTimestampInterval(interval);

    const monthlyCounts: { year: number; month: number; count: number }[] = [];

    for (const wallets of walletsByInterval) {
      const startDate = new Date(wallets.startTimestamp);
      const endDate = new Date(wallets.endTimestamp);
      const year = startDate.getFullYear();
      const month = startDate.getMonth() + 1;
      const count = wallets.wallet.length;

      monthlyCounts.push({ year, month, count });
    }

    return monthlyCounts;
  }
}
