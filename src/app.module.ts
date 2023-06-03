import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import * as path from "path";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import postgresConfig from "./common/config/postgres.config";
import { EtherscanApiModule } from "./external-api/etherscan/etherscan-api.module";
import etherscanApiConfig from "./common/config/etherscan.api.config";
import { WalletService } from "./wallet/wallet.service";
import { Transaction } from "@common/database/entities/transaction.entity";
import { Wallet } from "@common/database/entities/wallet.entity";
import { Protocol } from "@common/database/entities/protocol.entity";
import { TransactionModule } from "./transaction/transaction.module";
import { TransactionService } from "./transaction/transaction.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig, etherscanApiConfig],
      envFilePath: path.join("env", `.${process.env.NODE_ENV}.env`),
      ignoreEnvFile: !(process.env.NODE_ENV === "local"),
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
    }),
    TypeOrmModule.forRoot({
      ...postgresConfig().postgres,
    }),
    TypeOrmModule.forFeature([Transaction, Wallet, Protocol]),
    EtherscanApiModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService, WalletService, TransactionService],
})
export class AppModule {}
