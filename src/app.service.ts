import { Injectable } from "@nestjs/common";
import { EtherscanApiService } from "./external-api/etherscan/etherscan-api.service";
import { GetBriefReq, GetBreifRes } from "./app.dtos";

@Injectable()
export class AppService {
  private _getDummyBrief(): GetBreifRes {
    const dummyBrief: GetBreifRes = {
      newDatasHistory: {
        day: 10,
        week: 50,
        month: 200,
      },
      newDatasChart: [
        {
          startTimestamp: "2023-06-01T09:00:00.000Z",
          endTimestamp: "2023-06-01T17:00:00.000Z",
          num: 100,
        },
        {
          startTimestamp: "2023-06-02T09:00:00.000Z",
          endTimestamp: "2023-06-02T17:00:00.000Z",
          num: 150,
        },
      ],
      newDatasList: [
        {
          address: "0x4950631e0D68A9E9E53b9466f50dCE161F88e42d",
          timestamp: "2023-06-01T10:30:00.000Z",
        },
        {
          address: "0x2DEA4f469E0C0A3cCA25606bBd684474830f0fDA",
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
    return await this._getDummyBrief();
  }

  async getTxBrief(txBreifReq: GetBriefReq): Promise<GetBreifRes> {
    return await this._getDummyBrief();
  }
}
