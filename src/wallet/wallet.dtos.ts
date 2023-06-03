import { Wallet } from "../common/database/entities/wallet.entity";

export class ChartElement {
  startTimestamp: number;
  endTimestamp: number;
  wallets: Wallet[];
  newWallets: Wallet[];
  newWalletCumulativeNum: number;
}
