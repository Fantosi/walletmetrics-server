import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EtherscanApiService } from "./etherscan-api.service";

import { HttpModule } from "@nestjs/axios";
import { EtherscanApiConfig } from "@common/config/etherscan.api.config";

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: async (c: ConfigService) => ({
        baseURL: `${c.get<EtherscanApiConfig>("EtherscanApi").url}`,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EtherscanApiService],
  exports: [EtherscanApiService],
})
export class EtherscanApiModule {
  constructor(private etherscanApiService: EtherscanApiService) {
    this.etherscanApiService.getTxList();
  }
}
