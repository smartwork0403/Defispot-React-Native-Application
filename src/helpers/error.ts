import {Asset} from '../SDKs/multichain-sdk';

const ORIGIN_UTXO_ERROR_MSG = 'No utxos to send';
const PROCESSED_UTXO_ERROR_MSG =
  'Please wait a bit until UTXOs are confirmed and Try again.';
const INSUFFICIENT_FUND_ERROR_MSG = 'insufficient fund';
const INSUFFICIENT_FUND_ERROR_MSG_BNB =
  'Transaction failed. Not enough BNB in wallet to cover gas fee';
const INSUFFICIENT_FUND_ERROR_MSG_ETH =
  'Transaction failed. Not enough ETH or Luna in wallet to cover gas fee';

export const translateErrorMsg = (msg: string) => {
  if (msg.includes(ORIGIN_UTXO_ERROR_MSG)) {
    return PROCESSED_UTXO_ERROR_MSG;
  }
  if (msg.includes(INSUFFICIENT_FUND_ERROR_MSG)) {
    if (msg.toLowerCase().includes(Asset.BNB().chain.toLowerCase())) {
      return INSUFFICIENT_FUND_ERROR_MSG_BNB;
    }
    if (msg.toLowerCase().includes(Asset.ETH().chain.toLowerCase())) {
      return INSUFFICIENT_FUND_ERROR_MSG_ETH;
    }
    return msg;
  }

  return msg;
};
