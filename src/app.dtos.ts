export class GetBriefReq {
  protocolAddress: string;
  timeStampInterval: string;
}

export class NewDataTimestamp {
  startTimestamp: string; // Date
  endTimestamp: string; // Date
  num: number;
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
  newDatasDayChart: NewDataTimestamp[];
  newDatasWeekChart: NewDataTimestamp[];
  newDatasMonthChart: NewDataTimestamp[];
  newDatasList: NewData[]; // currenty 20 (tmp)
  totalDatasNum: number;
  activatedDailyDatasNum: number;
  activatedWeekDatasNum: number;
  activatedMonthlyDatasNum: number;
}
