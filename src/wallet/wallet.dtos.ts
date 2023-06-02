import { Wallet } from "@common/database/entities/wallet.entity";

export class WalletsByTimestampInterval {
  startTimestamp: number;
  endTimestamp: number;
  wallet: Wallet[];
}
