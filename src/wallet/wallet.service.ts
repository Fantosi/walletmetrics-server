import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";
import { Wallet } from "../common/database/entities/wallet.entity";
import { Transaction } from "@common/database/entities/transaction.entity";
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

  async getNewWalletsByInterval(
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
}
