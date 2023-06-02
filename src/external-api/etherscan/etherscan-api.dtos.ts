export class EtherscanApiResponse {
  status: any;
  data: EtherScanResponse;
}

export type EtherScanResponse = {
  status: string;
  message: string;
  result: TransactionDto[];
};

export class TransactionDto {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  methodId: string;
  functionName: string;
}

export type EtherScanTxListRequest = {
  address: string;
  startblock: string;
  endblock: string;
  page: string;
  offset: string;
  sort: string;
  apikey: string;
};
