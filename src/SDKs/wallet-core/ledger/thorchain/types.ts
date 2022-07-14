export const THORCHAIN_NETWORK = 931;

export const THORCHAIN_ID = 'thorchain-mainnet-v1';

export type GetAddressAndPubKeyResponse = {
  bech32_address: string;
  compressed_pk: any;
  error_message: string;
  return_code: number;
};

export type Signature = {
  pub_key: {
    type: string;
    value: string;
  };
  signature: string;
};

export type Coin = {
  amount: string;
  denom: string;
};

export type Fee = {
  amount: Coin[];
  gas: string;
};

export type SendCoinsMessage = {
  amount: Coin[];
  from_address: string;
  to_address: string;
};

export type SendMessage = {
  type: 'thorchain/MsgSend';
  value: SendCoinsMessage;
};

export type THORChainSendTx = {
  account_number: string;
  chain_id: string;
  fee: Fee;
  memo: string;
  msgs: SendMessage[];
  sequence: string;
};

export type THORChainDepositTx = {
  account_number: string;
  chain_id: string;
  fee: Fee;
  memo: string;
  msgs: any[];
  sequence: string;
};
