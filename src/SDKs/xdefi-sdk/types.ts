import {CosmosChain} from '@thorwallet/xchain-util';

import {
  BTCChain,
  BNBChain,
  THORChain,
  ETHChain,
  LTCChain,
  BCHChain,
  DOGEChain,
} from './constants';

// note only supported chains
export const supportedChains = [
  BTCChain,
  BNBChain,
  THORChain,
  ETHChain,
  LTCChain,
  BCHChain,
  DOGEChain,
  CosmosChain,
] as const;
export type SupportedChain = typeof supportedChains[number];

export type TxParams = {
  asset: string; // BNB.RUNE-B1A, BTC.BTC, ETH.USDT-0xffffff
  amount: number;
  decimal: number;
  recipient: string;
  memo?: string;
};

export type Asset = {
  chain: string;
  symbol: string;
  ticker: string;
};

export type XdefiTxParams = {
  from: string;
  recipient: string;
  feeRate?: number;
  asset: Asset;
  amount: {
    amount: number;
    decimals: number;
  };
  memo?: string;
};
