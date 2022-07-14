export const BTCChain = 'BTC';
export const BNBChain = 'BNB';
export const THORChain = 'THOR';
export const ETHChain = 'ETH';
export const LTCChain = 'LTC';
export const BCHChain = 'BCH';
export const DOGEChain = 'DOGE';

export type Provider = {
  title: string;
  providerPath: string;
};

export const providersList: Provider[] = [
  {
    title: 'Ethereum Provider',
    providerPath: 'xfi.ethereum',
  },
  {
    title: 'Bitcoin Provider',
    providerPath: 'xfi.bitcoin',
  },
  {
    title: 'BinanceDEX Provider',
    providerPath: 'xfi.binance',
  },
  {
    title: 'BitcoinCash Provider',
    providerPath: 'xfi.bitcoincash',
  },
  {
    title: 'LiteCoin Provider',
    providerPath: 'xfi.litecoin',
  },
  {
    title: 'Thorchain Provider',
    providerPath: 'xfi.thorchain',
  },
  {
    title: 'Dogecoin Provider',
    providerPath: 'xfi.dogecoin',
  },
  // TODO: add provider for Cosmos
];

export const THORCHAIN_POOL_ADDRESS = '';
