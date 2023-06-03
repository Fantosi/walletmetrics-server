import { Transaction } from "@common/database/entities/transaction.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetTxChartDto, TxChart, TxChartElement } from "./transaction.dtos";
import { NewData } from "src/app.dtos";

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private _transactionRepository: Repository<Transaction>,
  ) {}

  async getAllTxChart(protocolAddress: string, intervalTimestamps: number[]): Promise<GetTxChartDto> {
    const query = this._transactionRepository
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.protocol", "protocol")
      .where("protocol.protocolAddress = :protocolAddress", {
        protocolAddress,
      });

    const transactions: Transaction[] = await query.getMany();
    const txCharts: TxChart[] = [];

    for (const intervalTimestamp of intervalTimestamps) {
      txCharts.push(this._getTxChart(transactions, intervalTimestamp));
    }

    return { charts: txCharts, totalDatasNum: transactions.length };
  }

  private _getTxChart(transactions: Transaction[], intervalTimestamp: number): TxChartElement[] {
    const response: TxChartElement[] = [];

    /* timestamp: genensis block */
    let currentStartTimestamp = 1600000000;
    let currentEndTimestamp = currentStartTimestamp + intervalTimestamp;
    const endTimestamp = Math.floor(Date.now() / 1000);

    let transactionsCumulativeNum = 0;

    while (currentEndTimestamp <= endTimestamp) {
      const activeTransactions: Transaction[] = [];
      for (const transaction of transactions) {
        if (transaction.timestamp >= currentStartTimestamp && transaction.timestamp <= currentEndTimestamp) {
          activeTransactions.push(transaction);
        }
      }

      transactionsCumulativeNum += activeTransactions.length;

      response.push({
        startTimestamp: currentStartTimestamp,
        endTimestamp: currentEndTimestamp,
        transactions: activeTransactions,
        transactionsCumulativeNum,
      });

      currentStartTimestamp = currentEndTimestamp;
      currentEndTimestamp += intervalTimestamp;
    }

    return response;
  }

  private _sliceTransactionsByIndex(
    chart: TxChartElement[],
    indexStartTimestamp: number,
    indexEndTimestamp: number,
  ): TxChartElement[] {
    const slicedWalletsByIndex = chart.filter(
      (data) => data.startTimestamp >= indexStartTimestamp && data.endTimestamp <= indexEndTimestamp,
    );
    return slicedWalletsByIndex;
  }

  getNewTransaction(chart: TxChartElement[], num: number): NewData[] {
    const newTransactions: NewData[] = [];
    let cnt = num,
      currentIndex = chart.length - 1;

    while (cnt > 0 && currentIndex >= 0) {
      for (const transaction of chart[currentIndex].transactions) {
        newTransactions.push({
          address: transaction.hash,
          timestamp: new Date(transaction.timestamp * 1000),
        });

        if (--cnt === 0) {
          break;
        }
      }

      currentIndex--;
    }

    return newTransactions;
  }

  getTransactionGrowthRate(chart: TxChartElement[], indexStartTimestamp: number, indexEndTimestamp: number): number {
    const lastChart = this._sliceTransactionsByIndex(chart, indexStartTimestamp, indexEndTimestamp);

    const firstInterval = lastChart[0];
    const lastInterval = lastChart[lastChart.length - 1];
    const initialCount = firstInterval.transactionsCumulativeNum;
    const finalCount = lastInterval.transactionsCumulativeNum;

    if (initialCount === 0) {
      return 0;
    }

    return ((finalCount - initialCount) / initialCount) * 100;
  }

  getTransactionCount(chart: TxChartElement[], indexStartTimestamp: number, indexEndTimestamp: number): number {
    const lastChart = this._sliceTransactionsByIndex(chart, indexStartTimestamp, indexEndTimestamp);

    const count = lastChart.reduce(
      (count, transactionsInterval) => count + transactionsInterval.transactions.length,
      0,
    );
    return count;
  }
}
