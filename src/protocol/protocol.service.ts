import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "../common/database/entities/transaction.entity";
import { Wallet } from "../common/database/entities/wallet.entity";
import { Protocol } from "../common/database/entities/protocol.entity";

@Injectable()
export class ProtocolService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Protocol)
    private protocolRepository: Repository<Protocol>,
  ) {}

  async getProtocolTransactions(protocolAddress: string): Promise<Transaction[]> {
    const protocol = await this.protocolRepository.findOneBy({ protocolAddress });
    if (!protocol) {
      // 프로토콜을 찾을 수 없을 경우 예외 처리
      throw new Error(`Protocol with address ${protocolAddress} not found.`);
    }
    return this.transactionRepository.findBy({ protocolId: protocol.id });
  }

  async getProtocolWallets(protocolAddress: string): Promise<Wallet[]> {
    const protocol = await this.protocolRepository.findOneBy({ protocolAddress });
    if (!protocol) {
      // 프로토콜을 찾을 수 없을 경우 예외 처리
      throw new Error(`Protocol with address ${protocolAddress} not found.`);
    }
    const wallets = await this.walletRepository
      .createQueryBuilder("wallet")
      .leftJoinAndSelect("wallet.transaction", "transaction")
      .where("transaction.protocolId = :protocolId", { protocolId: protocol.id })
      .getMany();
    return wallets;
  }
}
