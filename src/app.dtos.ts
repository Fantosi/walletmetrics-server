export class GetBriefReq {
  protocolAddress: string;
  timeStampInterval: string;
}

export class NewWalletChartElement {
  startDate: Date;
  endDate: Date;
  newWalletNum: number;
}

export class NewData {
  address: string;
  timestamp: string; // Date
}

export class GetBreifRes {
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

export const DAY_TIMESTAMP = 24 * 60 * 60 * 1000;
export const WEEK_TIMESTAMP = 7 * DAY_TIMESTAMP;
export const MONTH_TIMESTAMP = 30 * DAY_TIMESTAMP;
