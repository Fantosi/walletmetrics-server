export class NewDataChartElement {
  startDate: Date;
  endDate: Date;
  newDataNum: number;
  newDataCumulativeNum: number;
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
  newDatasChart: {
    newDatasDayChart: NewDataChartElement[];
    newDatasWeekChart: NewDataChartElement[];
    newDatasMonthChart: NewDataChartElement[];
  };
  newDatasList: NewData[]; // currenty 20 (tmp)
  datasNum: {
    totalDatasNum: number;
    activatedDailyDatasNum: number;
    activatedWeekDatasNum: number;
    activatedMonthlyDatasNum: number;
  };
}

export class StartTimestamps {
  startTimestampsDay: number;
  startTimestampsWeek: number;
  startTimestampsMonth: number;
}

export const DAY_TIMESTAMP = 86400;
export const WEEK_TIMESTAMP = 7 * DAY_TIMESTAMP;
export const MONTH_TIMESTAMP = 30 * DAY_TIMESTAMP;
