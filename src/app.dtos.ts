export class NewWalletTimestamp {
  startTimestamp: number;
  endTimestamp: number;
  walletNum: number;
}

export class NewWallet {
  walletAddress: string;
  firstTxTimestamp: number;
}

export class UserBreifDto {
  walletFlowHistory: {
    day: number;
    week: number;
    month: number;
  };
  walletFlowChart: NewWalletTimestamp[];
  newWalletsList: NewWallet[]; // currenty 20 (tmp)
  totalWalletsNum: number;
  activatedDailyWalletsNum: number;
  activatedWeekWalletsNum: number;
  activatedMonthlyWalletsNum: number;
}
