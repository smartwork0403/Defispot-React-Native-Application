import {Network} from '@thorwallet/xchain-client';
import axios, {AxiosResponse} from 'axios';

import {midgardAPI, thornodeAPI} from './config';
import {InboundAddressesItem} from './types';

export const getInboundData = (
  network: Network,
): Promise<AxiosResponse<InboundAddressesItem[]>> => {
  return axios.get(midgardAPI('v2/thorchain/inbound_addresses', network));
};

// https://docs.thorchain.org/how-it-works/governance#mimir
export const getThorchainMimir = (network: Network) => {
  return axios.get(thornodeAPI('mimir', network));
};
