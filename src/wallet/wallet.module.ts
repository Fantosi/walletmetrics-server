import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Wallet } from "../common/database/entities/wallet.entity";
import { Transaction } from "../common/database/entities/transaction.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  providers: [WalletService],
})
export class WalletModule {}
