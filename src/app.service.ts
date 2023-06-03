import { Injectable } from "@nestjs/common";
import { EtherscanApiService } from "./external-api/etherscan/etherscan-api.service";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }
}
