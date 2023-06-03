import { Wallet } from "@common/database/entities/wallet.entity";

export class WalletsByTimestampInterval {
  startTimestamp: number;
  endTimestamp: number;
  wallets: Wallet[];
  newWallets: Wallet[];
}
