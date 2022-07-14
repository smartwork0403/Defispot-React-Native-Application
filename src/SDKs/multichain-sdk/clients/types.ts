import {FeeOption, TxHash} from '@xchainjs/xchain-client';
import {
  BTCChain,
  BNBChain,
  THORChain,
  ETHChain,
  LTCChain,
  BCHChain,
  BaseAmount,
  DOGEChain,
  CosmosChain,
  Chain,
} from '@xchainjs/xchain-util';

import {AssetAmount, Pool, Percent} from '../entities';

export type TxParams = {
  assetAmount: AssetAmount;
  recipient: string;
  memo?: string;
  feeOption?: FeeOption;
  feeRate?: number;
};

export type MultiSendParams = {
  assetAmount1: AssetAmount;
  assetAmount2: AssetAmount;
  recipient: string;
  memo?: string;
};

export type AddLiquidityParams = {
  pool: Pool;
  runeAmount?: AssetAmount;
  assetAmount?: AssetAmount;
  affiliate?: string;
};

export type CreateLiquidityParams = {
  runeAmount: AssetAmount;
  assetAmount: AssetAmount;
};

export type AddLiquidityTxns = {
  runeTx?: TxHash;
  assetTx?: TxHash;
};

export type LPType = 'sym' | 'rune' | 'asset';

export type WithdrawParams = {
  pool: Pool;
  percent: Percent;
  from: LPType;
  to: LPType;
};

// note only supported chains
export const SUPPORTED_CHAINS = [
  THORChain,
  BNBChain,
  BTCChain,
  ETHChain,
  LTCChain,
  BCHChain,
  DOGEChain,
  CosmosChain,
] as const;
export type SupportedChain = typeof SUPPORTED_CHAINS[number];

// ledger supported chains
export const LEDGER_SUPPORTED_CHAINS = [THORChain, BNBChain] as const;

export type ApproveParams = {
  contractAddress: string;
  spenderAddress: string;
  feeOption?: FeeOption;
  amount?: BaseAmount;
  // Optional fallback in case estimation for gas limit fails
};

export type DepositParams = TxParams & {
  router: string;
};

export type UpgradeParams = {
  runeAmount: AssetAmount;
  recipient: string;
};

export enum WalletOption {
  'KEYSTORE' = 'KEYSTORE',
  'XDEFI' = 'XDEFI',
  'METAMASK' = 'METAMASK',
  'TRUSTWALLET' = 'TRUSTWALLET',
  'LEDGER' = 'LEDGER',
}

export enum NewChain {
  BinanceSmartChain = 'BSC',
}
export type DefispotChain = Chain | NewChain;

export type ChainWallet = {
  address: string;
  balance: AssetAmount[];
  walletType: WalletOption;
};

export type Wallet = Record<SupportedChain, ChainWallet | null>;
