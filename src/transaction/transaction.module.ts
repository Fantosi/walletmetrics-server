import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "@common/database/entities/transaction.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionService],
})
export class TransactionModule {}
