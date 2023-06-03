export class NewWalletChartElement {
  startDate: Date;
  endDate: Date;
  newWalletNum: number;
  newWalletCumulativeNum: number;
}

export class NewData {
  address: string;
  timestamp: Date; // Date
}

export class GetBriefRes {
  newDatasHistory: {
    day: number;
    week: number;
    month: number;
  };
  newDatasDayChart: NewWalletChartElement[];
  newDatasWeekChart: NewWalletChartElement[];
  newDatasMonthChart: NewWalletChartElement[];
  newDatasList: NewData[]; // currenty 20 (tmp)
  totalDatasNum: number;
  activatedDailyDatasNum: number;
  activatedWeekDatasNum: number;
  activatedMonthlyDatasNum: number;
}

export class StartTimestamps {
  startTimestampsDay: number;
  startTimestampsWeek: number;
  startTimestampsMonth: number;
}

export const DAY_TIMESTAMP = 86400;
export const WEEK_TIMESTAMP = 7 * DAY_TIMESTAMP;
export const MONTH_TIMESTAMP = 30 * DAY_TIMESTAMP;
