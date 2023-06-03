import { Injectable } from "@nestjs/common";
import { EtherscanApiService } from "./external-api/etherscan/etherscan-api.service";
import {
  GetBriefReq,
  GetBreifRes,
  StartTimestamps,
  DAY_TIMESTAMP,
  WEEK_TIMESTAMP,
  MONTH_TIMESTAMP,
  NewWalletChartElement,
} from "./app.dtos";
import { WalletService } from "./wallet/wallet.service";
import { ChartElement } from "./wallet/wallet.dtos";

@Injectable()
export class AppService {
  constructor(private readonly _walletService: WalletService) {}

  private _getDummyBrief(): GetBreifRes {
    const dummyBrief: GetBreifRes = {
      newDatasHistory: {
        day: 10,
        week: 50,
        month: 200,
      },
      newDatasDayChart: [
        {
          startDate: new Date("2023-06-01T09:00:00.000Z"),
          endDate: new Date("2023-06-02T09:00:00.000Z"),
          newWalletNum: 100,
        },
        {
          startDate: new Date("2023-06-02T09:00:00.000Z"),
          endDate: new Date("2023-06-03T09:00:00.000Z"),
          newWalletNum: 150,
        },
      ],
      newDatasWeekChart: [
        {
          startDate: new Date("2023-06-01T09:00:00.000Z"),
          endDate: new Date("2023-06-08T09:00:00.000Z"),
          newWalletNum: 100,
        },
        {
          startDate: new Date("2023-06-08T09:00:00.000Z"),
          endDate: new Date("2023-06-15T09:00:00.000Z"),
          newWalletNum: 150,
        },
      ],
      newDatasMonthChart: [
        {
          startDate: new Date("2023-06-01T09:00:00.000Z"),
          endDate: new Date("2023-07-01T09:00:00.000Z"),
          newWalletNum: 100,
        },
        {
          startDate: new Date("2023-07-01T09:00:00.000Z"),
          endDate: new Date("2023-08-01T09:00:00.000Z"),
          newWalletNum: 150,
        },
      ],
      newDatasList: [
        {
          address: "0x1234567890abcdef",
          timestamp: "2023-06-01T10:30:00.000Z",
        },
        {
          address: "0x9876543210fedcba",
          timestamp: "2023-06-02T14:45:00.000Z",
        },
      ],
      totalDatasNum: 250,
      activatedDailyDatasNum: 50,
      activatedWeekDatasNum: 180,
      activatedMonthlyDatasNum: 400,
    };

    return dummyBrief;
  }

  async getUserBrief(userBreifReq: GetBriefReq): Promise<GetBreifRes> {
    /* chart 가져오기 */
    const dayWalletChart = await this._walletService.getChart(DAY_TIMESTAMP);
    const weekWalletChart = await this._walletService.getChart(WEEK_TIMESTAMP);
    const monthWalletChart = await this._walletService.getChart(MONTH_TIMESTAMP);

    const endTimestamp = Date.now();
    const { startTimestampsDay, startTimestampsWeek, startTimestampsMonth } = this._getStartTimestamp(endTimestamp);

    /* 신규 지갑 계산 */
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
    const response: GetBreifRes = {
      newDatasHistory: {
        day: dayNewWalletRate,
        week: weekNewWalletRate,
        month: monthNewWalletRate,
      },
      newDatasDayChart: this._convertToNewWalletChartElementArray(dayWalletChart),
      newDatasWeekChart: this._convertToNewWalletChartElementArray(weekWalletChart),
      newDatasMonthChart: this._convertToNewWalletChartElementArray(monthWalletChart),
      newDatasList: [
        {
          address: "0x1234567890abcdef",
          timestamp: "2023-06-01T10:30:00.000Z",
        },
        {
          address: "0x9876543210fedcba",
          timestamp: "2023-06-02T14:45:00.000Z",
        },
      ],
      totalDatasNum: 250,
      activatedDailyDatasNum: dayActiveWalletCount,
      activatedWeekDatasNum: weekActiveWalletCount,
      activatedMonthlyDatasNum: monthActiveWalletCount,
    };

    return response;
  }

  async getTxBrief(txBreifReq: GetBriefReq): Promise<GetBreifRes> {
    return await this._getDummyBrief();
  }

  private _getStartTimestamp(endTimestamp: number): StartTimestamps {
    const startTimestampsDay = endTimestamp - 24 * 60 * 60 * 1000; // 1일 전
    const startTimestampsWeek = endTimestamp - 7 * 24 * 60 * 60 * 1000; // 7일 전
    const startTimestampsMonth = endTimestamp - 30 * 24 * 60 * 60 * 1000; // 30일 전

    return { startTimestampsDay, startTimestampsWeek, startTimestampsMonth };
  }

  private _unixTimestampToDate(timestamp: number): Date {
    return new Date(timestamp * 1000); // Unix 타임스탬프는 초 단위이므로 1000을 곱해 밀리초로 변환
  }

  private _convertToNewWalletChartElementArray(chartElements: ChartElement[]): NewWalletChartElement[] {
    return chartElements.map((chartElement) => {
      const { startTimestamp, endTimestamp, newWallets } = chartElement;
      const newWalletNum = newWallets.length;

      const startDate = this._unixTimestampToDate(startTimestamp);
      const endDate = this._unixTimestampToDate(endTimestamp);

      return { startDate, endDate, newWalletNum };
    });
  }
}
