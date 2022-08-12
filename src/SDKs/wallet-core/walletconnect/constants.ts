import {WalletCore, TW} from '@trustwallet/wallet-core';
import {BNBChain, ETHChain, THORChain} from '@xchainjs/xchain-util';

export const supportedNetworks: WalletCore.CoinType[] = [
  WalletCore.CoinType.binance,
  WalletCore.CoinType.ethereum,
  WalletCore.CoinType.thorchain,
];

export const networkByChain = {
  [BNBChain]: WalletCore.CoinType.binance,
  [ETHChain]: WalletCore.CoinType.ethereum,
  [THORChain]: WalletCore.CoinType.thorchain,
};

export const protoSigningInput = {
  BTC: TW.Bitcoin.Proto.SigningInput,
  BNB: TW.Binance.Proto.SigningInput,
  ETH: TW.Ethereum.Proto.SigningInput,
};

export const errorCodes = {
  ERROR_SESSION_CONNECTED: 'Session currently connected',
  ERROR_SESSION_DISCONNECTED: 'Session currently disconnected',
  ERROR_SESSION_REJECTED: 'Session Rejected',

  ERROR_CHAIN_NOT_SUPPORTED: 'Chain is currently not supported',

  ERROR_MISSING_JSON_RPC: 'Missing JSON RPC response',
  ERROR_MISSING_RESULT: 'JSON-RPC success response must include "result" field',
  ERROR_MISSING_ERROR: 'JSON-RPC error response must include "error" field',
  ERROR_MISSING_METHOD: 'JSON RPC request must have valid "method" value',
  ERROR_MISSING_ID: 'JSON RPC request must have valid "id" value',
  ERROR_MISSING_REQUIRED:
    'Missing one of the required parameters: bridge / uri / session',

  ERROR_INVALID_RESPONSE: 'JSON RPC response format is invalid',
  ERROR_INVALID_URI: 'URI format is invalid',

  ERROR_QRCODE_MODAL_NOT_PROVIDED: 'QRCode Modal not provided',
  ERROR_QRCODE_MODAL_USER_CLOSED: 'User close QRCode Modal',
};
