export interface EtherscanApiConfig {
  url: string;
  apiKey: string;
}

export default () =>
  ({
    EtherscanApi: {
      url: process.env.ETHERSCAN_API_URL,
      apiKey: process.env.ETHERSCAN_API_KEY,
    },
    GnosisscanApi: {
      url: process.env.GNOSISSCAN_API_URL,
      apiKey: process.env.GNOSISSCAN_API_KEY,
    },
  } as { EtherscanApi: EtherscanApiConfig });
