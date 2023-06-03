import { Transaction } from "@common/database/entities/transaction.entity";

export class TxChartElement {
  startTimestamp: number;
  endTimestamp: number;
  transactions: Transaction[];
  transactionsCumulativeNum: number;
}
