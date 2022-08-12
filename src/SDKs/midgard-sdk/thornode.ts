import {Network} from '@xchainjs/xchain-client';
import axios from 'axios';

import {
  MIDGARD_CHAOSNET_URL,
  MIDGARD_STAGENET_URL,
  MIDGARD_TESTNET_URL,
} from './config';

export const getMidgardBaseUrl = (network: Network) => {
  if (network === Network.Mainnet) {
    return MIDGARD_CHAOSNET_URL;
  }
  if (network === Network.Stagenet) {
    return MIDGARD_STAGENET_URL;
  }
  return MIDGARD_TESTNET_URL;
};

// https://thornode.thorchain.info/thorchain/inbound_addresses
export const getThornodeInboundAddress = async (network: Network) => {
  const baseUrl = getMidgardBaseUrl(network);

  const response = await axios.get(`${baseUrl}/v2/thorchain/inbound_addresses`);

  return response;
};
