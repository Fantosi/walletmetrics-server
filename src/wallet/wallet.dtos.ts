import { Wallet } from "../common/database/entities/wallet.entity";

export class ChartElement {
  startTimestamp: number;
  endTimestamp: number;
  wallets: Wallet[];
  newWallets: Wallet[];
  newWalletCumulativeNum: number;
}

export type Chart = ChartElement[];

export class GetChartDto {
  charts: Chart[];
  totalDatasNum: number;
}
