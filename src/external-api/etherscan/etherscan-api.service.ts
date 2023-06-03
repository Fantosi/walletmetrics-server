import { ConsoleLogger, Injectable } from "@nestjs/common";
import { EtherscanApiResponse, EtherScanResponse, TransactionDto, EtherScanTxListRequest } from "./etherscan-api.dtos";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";
import { Transaction } from "../../common/database/entities/transaction.entity";
import { Wallet } from "../../common/database/entities/wallet.entity";
import { Protocol } from "../../common/database/entities/protocol.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ethers } from "ethers";

@Injectable()
export class EtherscanApiService {
  baseUrl = this.configService.get<string>("EtherscanApi.url");
  apiKey = this.configService.get<string>("EtherscanApi.apiKey");

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Protocol)
    private protocolRepository: Repository<Protocol>,
  ) {
    const check = async () => {
      // const isSynced = await this.syncTransactions("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
      // console.log("isSynced", isSynced);
    };
    check();
  }

  async getTxList() {
    const result: TransactionDto[] = [];
    // const baseUrl = this.configService.get<string>("EtherscanApi.url");
    // const apiKey = this.configService.get<string>("EtherscanApi.apiKey");

    const request: EtherScanTxListRequest = {
      address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      startblock: "0",
      endblock: "99999999",
      page: "1",
      offset: "10",
      sort: "desc",
      apikey: this.apiKey,
    };

    const url = `${this.baseUrl}&address=${request.address}&startblock=${request.startblock}&endblock=${request.endblock}&page=${request.page}&offset=${request.offset}&sort=${request.sort}&apikey=${request.apikey}`;

    const { data } = await firstValueFrom(this.httpService.get<EtherScanResponse>(url).pipe());

    if (data.status === "1") {
      data.result.forEach((tx) => {
        result.push(tx);
      });
    }

    for (const tx of result) {
      await this.createTransaction(tx);
    }
    // await this.deleteTables();
    return result;
  }

  async createTransaction(transactionDto: TransactionDto): Promise<boolean> {
    const { from: walletAddress, to: protocolAddress, timeStamp, value, hash, blockNumber } = transactionDto;
    try {
      console.log("createTransaction", JSON.stringify(transactionDto));
      let wallet = await this.walletRepository.findOne({ where: { walletAddress } });
      if (wallet == null) {
        wallet = await this.walletRepository.create({
          walletAddress,
          transactionNum: 0,
          transactions: [],
        });
      }
      wallet = await this.walletRepository.save(wallet);
      let protocol = await this.protocolRepository.findOne({ where: { protocolAddress } });
      console.log(protocol);

      if (protocol == null) {
        protocol = await this.protocolRepository.create({
          protocolAddress,
          protocolName: "",
          protocolType: "",
          transactions: [],
        });
      }

      protocol = await this.protocolRepository.save(protocol);

      const transaction = await this.transactionRepository.findOne({ where: { hash } });
      console.log("------", transaction);
      if (transaction == null) {
        await this.transactionRepository.save({
          wallet,
          protocol,
          timestamp: Number(timeStamp),
          hash,
          walletId: wallet.id,
          protocolId: protocol.id,
          eventName: "",
          totalValue: 0,
          coinValue: 0,
          tokenValue: 0,
          blockNumber: Number(blockNumber),
        });
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteTables() {
    try {
      await this.transactionRepository.delete({});
      await this.walletRepository.delete({});
      await this.protocolRepository.delete({});
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async checkIsSyncedByBlockNumber(protocolAddress: string): Promise<boolean> {
    try {
      const protocol = await this.protocolRepository.findOne({ where: { protocolAddress } });

      if (protocol == null) {
        return false;
      }

      const transactions = await this.transactionRepository.find({
        where: { protocolId: protocol.id },
        order: { blockNumber: "DESC" },
      });
      if (transactions == null || transactions.length === 0) {
        return false;
      }

      const savedLastBlockNumber = transactions[0].blockNumber;
      const lastBlockNumber = await this._getLastBlockNumberFromEtherscan(
        protocolAddress,
        savedLastBlockNumber.toString(),
      );

      if (lastBlockNumber == 0) {
        return false;
      }

      if (lastBlockNumber != savedLastBlockNumber) {
        return false;
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private async _getLastBlockNumberFromEtherscan(protocolAddress: string, savedBlockNumber: string): Promise<number> {
    const request: EtherScanTxListRequest = {
      address: protocolAddress,
      startblock: savedBlockNumber,
      endblock: "99999999",
      page: "1",
      offset: "1",
      sort: "desc",
      apikey: this.apiKey,
    };

    const url = `${this.baseUrl}&address=${request.address}&startblock=${request.startblock}&endblock=${request.endblock}&page=${request.page}&offset=${request.offset}&sort=${request.sort}&apikey=${request.apikey}`;

    const { data } = await firstValueFrom(this.httpService.get<EtherScanResponse>(url).pipe());

    if (data.status === "1") {
      return Number(data.result[0].blockNumber);
    }
    return 0;
  }

  async syncTransactions(protocolAddress: string): Promise<boolean> {
    try {
      const lowerCasedProtocolAddress = protocolAddress.toLowerCase();
      const isSynced = await this.checkIsSyncedByBlockNumber(lowerCasedProtocolAddress);
      if (isSynced) {
        return true;
      }

      const protocol = await this.protocolRepository.findOne({ where: { protocolAddress: lowerCasedProtocolAddress } });
      const protocolId = protocol.id;
      const transactions = await this.transactionRepository.find({
        where: { protocolId },
        order: { blockNumber: "DESC" },
      });
      const savedLastBlockNumber = transactions[0].blockNumber + 1;

      let page = 1;
      while (true) {
        const request: EtherScanTxListRequest = {
          address: lowerCasedProtocolAddress,
          startblock: savedLastBlockNumber.toString(),
          endblock: "99999999",
          page: page.toString(),
          offset: "500",
          sort: "desc",
          apikey: this.apiKey,
        };

        const url = `${this.baseUrl}&address=${request.address}&startblock=${request.startblock}&endblock=${request.endblock}&page=${request.page}&offset=${request.offset}&sort=${request.sort}&apikey=${request.apikey}`;

        const { data } = await firstValueFrom(this.httpService.get<EtherScanResponse>(url).pipe());

        if (data.status === "1") {
          for (const tx of data.result) {
            await this.createTransaction(tx);
          }
        }

        if (data.result.length < 500) {
          break;
        }

        page++;
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
