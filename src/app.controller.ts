import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { EtherscanApiService } from "./external-api/etherscan/etherscan-api.service";
import { GetBriefReq, GetBreifRes } from "./app.dtos";

@Controller()
export class AppController {
  constructor(private readonly _appService: AppService, private readonly _etherscanApiService: EtherscanApiService) {}

  @Get("isinit")
  async checkIsInit(@Query("protocolAddress") protocolAddress: string) {
    return true;
  }

  @Post("sync")
  async syncTransactions(@Query("protocolAddress") protocolAddress: string) {
    return await this._etherscanApiService.syncTransactions(protocolAddress);
  }

  @Get("userbreif")
  async getUserBrief(@Body() userBreifReq: GetBriefReq): Promise<GetBreifRes> {
    return await this._appService.getUserBrief(userBreifReq);
  }

  @Get("txbrief")
  async getTxBrief(@Body() txBreifReq: GetBriefReq): Promise<GetBreifRes> {
    return await this._appService.getTxBrief(txBreifReq);
  }
}
