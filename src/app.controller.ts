import { Body, Controller, Get, Header, Post, Query } from "@nestjs/common";
import { AppService } from "./app.service";
import { EtherscanApiService } from "./external-api/etherscan/etherscan-api.service";
import { GetBriefRes } from "./app.dtos";

@Controller()
export class AppController {
  constructor(private readonly _appService: AppService, private readonly _etherscanApiService: EtherscanApiService) {}

  @Get("isinit")
  async checkIsInit(@Query("protocolAddress") protocolAddress: string): Promise<boolean> {
    return await this._etherscanApiService.getIsInit(protocolAddress);
  }

  @Post("sync")
  async syncTransactions(@Query("protocolAddress") protocolAddress: string): Promise<boolean> {
    return await this._etherscanApiService.syncTransactions(protocolAddress);
  }

  @Get("userbrief")
  async getUserBrief(@Query("protocolAddress") protocolAddress: string): Promise<GetBriefRes> {
    return await this._appService.getUserBrief(protocolAddress);
  }

  @Get("txbrief")
  async getTxBrief(@Query("protocolAddress") protocolAddress: string): Promise<GetBriefRes> {
    return await this._appService.getTxBrief(protocolAddress);
  }
}
