import { Controller, Get, Post, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { EtherscanApiService } from "./external-api/etherscan/etherscan-api.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly etherscanApiService: EtherscanApiService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("sync")
  async syncTransactions(@Query("protocolAddress") protocolAddress: string) {
    return await this.etherscanApiService.syncTransactions(protocolAddress);
  }
}
