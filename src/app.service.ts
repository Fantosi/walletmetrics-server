import { Injectable } from "@nestjs/common";
import { EtherscanApiService } from "./external-api/etherscan/etherscan-api.service";
import {
  GetBriefRes,
  StartTimestamps,
  DAY_TIMESTAMP,
  WEEK_TIMESTAMP,
  MONTH_TIMESTAMP,
  NewDataChartElement,
} from "./app.dtos";
import { WalletService } from "./wallet/wallet.service";
import { ChartElement } from "./wallet/wallet.dtos";
import { TransactionService } from "./transaction/transaction.service";
import { TxChartElement } from "./transaction/transaction.dtos";

@Injectable()
export class AppService {
  constructor(
    private readonly _walletService: WalletService,
    private readonly _transactionService: TransactionService,
  ) {}

  async getUserBrief(protocolAddress: string): Promise<GetBriefRes> {
    const loweredProtocolAddress = protocolAddress.toLowerCase();

    /* chart 가져오기 */
    const { charts, totalDatasNum } = await this._walletService.getAllChart(loweredProtocolAddress, [
      DAY_TIMESTAMP,
      WEEK_TIMESTAMP,
      MONTH_TIMESTAMP,
    ]);

    const [dayWalletChart, weekWalletChart, monthWalletChart] = charts;

    const endTimestamp = dayWalletChart[dayWalletChart.length - 1].endTimestamp;
    const { startTimestampsDay, startTimestampsWeek, startTimestampsMonth } = this._getStartTimestamp(endTimestamp);

    /* 신규 지갑 계산 */
    const newWallets = this._walletService.getNewWallet(dayWalletChart, 30);
    const dayNewWalletRate = this._walletService.getWalletGrowthRate(dayWalletChart, startTimestampsDay, endTimestamp);
    const weekNewWalletRate = this._walletService.getWalletGrowthRate(
      dayWalletChart,
      startTimestampsWeek,
      endTimestamp,
    );
    const monthNewWalletRate = this._walletService.getWalletGrowthRate(
      dayWalletChart,
      startTimestampsMonth,
      endTimestamp,
    );

    /* 활성화 지갑 계산 */
    const dayActiveWalletCount = this._walletService.getActiveWalletCount(
      dayWalletChart,
      startTimestampsDay,
      endTimestamp,
    );
    const weekActiveWalletCount = this._walletService.getActiveWalletCount(
      dayWalletChart,
      startTimestampsWeek,
      endTimestamp,
    );
    const monthActiveWalletCount = this._walletService.getActiveWalletCount(
      dayWalletChart,
      startTimestampsMonth,
      endTimestamp,
    );

    /* response DTO로 변환하여 반환 */
    const response: GetBriefRes = {
      newDatasHistory: {
        day: dayNewWalletRate,
        week: weekNewWalletRate,
        month: monthNewWalletRate,
      },
      newDatasChart: {
        newDatasDayChart: this._convertToNewWalletChartElementArray(dayWalletChart),
        newDatasWeekChart: this._convertToNewWalletChartElementArray(weekWalletChart),
        newDatasMonthChart: this._convertToNewWalletChartElementArray(monthWalletChart),
      },
      newDatasList: newWallets,
      datasNum: {
        totalDatasNum: totalDatasNum,
        activatedDailyDatasNum: dayActiveWalletCount,
        activatedWeekDatasNum: weekActiveWalletCount,
        activatedMonthlyDatasNum: monthActiveWalletCount,
      },
    };

    return response;
  }

  async getTxBrief(protocolAddress: string): Promise<GetBriefRes> {
    const loweredProtocolAddress = protocolAddress.toLowerCase();

    /* chart 가져오기 */
    const { charts, totalDatasNum } = await this._transactionService.getAllTxChart(loweredProtocolAddress, [
      DAY_TIMESTAMP,
      WEEK_TIMESTAMP,
      MONTH_TIMESTAMP,
    ]);

    const [dayTransactionChart, weekTransactionChart, monthTransactionChart] = charts;

    const endTimestamp = dayTransactionChart[dayTransactionChart.length - 1].endTimestamp;
    const { startTimestampsDay, startTimestampsWeek, startTimestampsMonth } = this._getStartTimestamp(endTimestamp);

    /* 신규 지갑 계산 */
    const newTransactions = this._transactionService.getNewTransaction(monthTransactionChart, 30);
    const dayNewTransactionRate = this._transactionService.getTransactionGrowthRate(
      dayTransactionChart,
      startTimestampsDay,
      endTimestamp,
    );
    const weekNewTransactionRate = this._transactionService.getTransactionGrowthRate(
      dayTransactionChart,
      startTimestampsWeek,
      endTimestamp,
    );
    const monthNewTransactionRate = this._transactionService.getTransactionGrowthRate(
      dayTransactionChart,
      startTimestampsMonth,
      endTimestamp,
    );

    /* 활성화 지갑 계산 */
    const dayActiveTransactionCount = this._transactionService.getTransactionCount(
      dayTransactionChart,
      startTimestampsDay,
      endTimestamp,
    );
    const weekActiveTransactionCount = this._transactionService.getTransactionCount(
      dayTransactionChart,
      startTimestampsWeek,
      endTimestamp,
    );
    const monthActiveTransactionCount = this._transactionService.getTransactionCount(
      dayTransactionChart,
      startTimestampsMonth,
      endTimestamp,
    );

    /* response DTO로 변환하여 반환 */
    const response: GetBriefRes = {
      newDatasHistory: {
        day: dayNewTransactionRate,
        week: weekNewTransactionRate,
        month: monthNewTransactionRate,
      },
      newDatasChart: {
        newDatasDayChart: this._convertToNewTransactionChartElementArray(dayTransactionChart),
        newDatasWeekChart: this._convertToNewTransactionChartElementArray(weekTransactionChart),
        newDatasMonthChart: this._convertToNewTransactionChartElementArray(monthTransactionChart),
      },
      newDatasList: newTransactions,
      datasNum: {
        totalDatasNum,
        activatedDailyDatasNum: dayActiveTransactionCount,
        activatedWeekDatasNum: weekActiveTransactionCount,
        activatedMonthlyDatasNum: monthActiveTransactionCount,
      },
    };

    return response;
  }

  private _getStartTimestamp(endTimestamp: number): StartTimestamps {
    const startTimestampsDay = endTimestamp - DAY_TIMESTAMP;
    const startTimestampsWeek = endTimestamp - WEEK_TIMESTAMP;
    const startTimestampsMonth = endTimestamp - MONTH_TIMESTAMP;

    return { startTimestampsDay, startTimestampsWeek, startTimestampsMonth };
  }

  private _unixTimestampToDate(timestamp: number): Date {
    return new Date(timestamp * 1000); // Unix 타임스탬프는 초 단위이므로 1000을 곱해 밀리초로 변환
  }

  private _convertToNewWalletChartElementArray(chartElements: ChartElement[]): NewDataChartElement[] {
    return chartElements.map((chartElement) => {
      const { startTimestamp, endTimestamp, newWallets, newWalletCumulativeNum } = chartElement;
      const newWalletNum = newWallets.length;

      const startDate = this._unixTimestampToDate(startTimestamp);
      const endDate = this._unixTimestampToDate(endTimestamp);

      return { startDate, endDate, newDataNum: newWalletNum, newDataCumulativeNum: newWalletCumulativeNum };
    });
  }

  private _convertToNewTransactionChartElementArray(txChartElements: TxChartElement[]): NewDataChartElement[] {
    return txChartElements.map((txChartElement) => {
      const { startTimestamp, endTimestamp, transactions, transactionsCumulativeNum } = txChartElement;
      const transactionsNum = transactions.length;

      const startDate = this._unixTimestampToDate(startTimestamp);
      const endDate = this._unixTimestampToDate(endTimestamp);

      return { startDate, endDate, newDataNum: transactionsNum, newDataCumulativeNum: transactionsCumulativeNum };
    });
  }
}
