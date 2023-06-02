import { Controller, Get, Param } from "@nestjs/common";
import { AppService } from "./app.service";
import { EtherscanApiService } from "@external-api/etherscan/etherscan-api.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly etherscanApiService: EtherscanApiService) {
    const check = async () => {
      const isSynced = await this.syncTransactions("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
      console.log("isSynced", isSynced);
    };
    check();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("/sync")
  async syncTransactions(@Param("address") address: string) {
    return await this.etherscanApiService.syncTransactions(address);
  }
}
