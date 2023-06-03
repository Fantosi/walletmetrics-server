import { Module } from "@nestjs/common";
import { ProtocolService } from "./protocol.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "../common/database/entities/transaction.entity";
import { Wallet } from "../common/database/entities/wallet.entity";
import { Protocol } from "../common/database/entities/protocol.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Wallet, Protocol])],
  providers: [ProtocolService],
})
export class ProtocolModule {}
