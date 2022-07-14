import {WalletCore} from '@trustwallet/wallet-core';

export const THORCHAIN_NETWORK = WalletCore.CoinType.thorchain;

export const THORCHAIN_ID = 'thorchain-mainnet-v1';

export type Coin = {
  denom: string;
  amount: string;
};

export type Fee = {
  amounts: Coin[];
  gas: string;
};

export type SendCoinsMessage = {
  fromAddress: string;
  toAddress: string;
  amounts: Coin[];
};

export type SendMessage = {
  sendCoinsMessage: SendCoinsMessage;
};

export type THORChainSendTx = {
  accountNumber: string;
  chainId: string;
  fee: Fee;
  memo: string;
  sequence: string;
  messages: SendMessage[];
};

export type RawJSONMessage = {
  rawJsonMessage: {
    type: string;
    value: string;
  };
};

export type THORChainDepositTx = {
  accountNumber: string;
  chainId: string;
  fee: Fee;
  memo: string;
  sequence: string;
  messages: RawJSONMessage[];
};
