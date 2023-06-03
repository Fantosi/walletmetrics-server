import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EtherscanApiService } from "./etherscan-api.service";

import { HttpModule } from "@nestjs/axios";
import { EtherscanApiConfig } from "../../common/config/etherscan.api.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "../../common/database/entities/transaction.entity";
import { Wallet } from "../../common/database/entities/wallet.entity";
import { Protocol } from "../../common/database/entities/protocol.entity";

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (c: ConfigService) => ({
        baseURL: `${c.get<EtherscanApiConfig>("EtherscanApi").url}`,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Transaction, Wallet, Protocol]),
  ],
  providers: [EtherscanApiService],
  exports: [EtherscanApiService],
})
export class EtherscanApiModule {
  constructor(private etherscanApiService: EtherscanApiService) {
    // this.etherscanApiService.getTxList();
  }
}
