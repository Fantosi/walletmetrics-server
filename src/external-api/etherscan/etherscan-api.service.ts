import { ConsoleLogger, Injectable } from "@nestjs/common";
import { EtherscanApiResponse, EtherScanResponse, EtherScanResult, EtherScanTxListRequest } from "./etherscan-api.dtos";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";

@Injectable()
export class EtherscanApiService {
  constructor(private httpService: HttpService, private configService: ConfigService) {}

  async getTxList() {
    const result: EtherScanResult[] = [];
    const baseUrl = this.configService.get<string>("EtherscanApi.url");
    const apiKey = this.configService.get<string>("EtherscanApi.apiKey");

    const request: EtherScanTxListRequest = {
      address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      startblock: "0",
      endblock: "99999999",
      page: "1",
      offset: "10",
      sort: "desc",
      apikey: apiKey,
    };

    const url = `${baseUrl}&address=${request.address}&startblock=${request.startblock}&endblock=${request.endblock}&page=${request.page}&offset=${request.offset}&sort=${request.sort}&apikey=${request.apikey}`;

    const { data } = await firstValueFrom(this.httpService.get<EtherScanResponse>(url).pipe());
    console.log(data);
    if (data.status === "1") {
      data.result.forEach((tx) => {
        result.push(tx);
      });
    }
    return result;
  }
}
