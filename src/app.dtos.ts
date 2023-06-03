export class NewDataTimestamp {
  startTimestamp: Date;
  endTimestamp: Date;
  num: number;
}

export class NewData {
  address: string;
  timestamp: Date;
}

export class BreifDto {
  newDatasHistory: {
    day: number;
    week: number;
    month: number;
  };
  newDatasChart: NewDataTimestamp[];
  newDatasList: NewData[]; // currenty 20 (tmp)
  totalDatasNum: number;
  activatedDailyDatasNum: number;
  activatedWeekDatasNum: number;
  activatedMonthlyDatasNum: number;
}

export type GetBreifRes = BreifDto[];
