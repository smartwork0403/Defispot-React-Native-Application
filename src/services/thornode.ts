import {Network} from '@xchainjs/xchain-client';
import axios, {AxiosResponse} from 'axios';
import {InboundAddressesItem} from '../SDKs/midgard-sdk';

import {
  MIDGARD_TESTNET_URL,
  MIDGARD_CHAOSNET_URL,
  THORNODE_TESTNET_URL,
  THORNODE_MAINNET_URL,
  THORNODE_STAGENET_URL,
  MIDGARD_STAGENET_URL,
} from '../SDKs/midgard-sdk/config';

import {LiquidityProvider} from '../redux/midgard/types';

import {config} from '../settings/config';

const THORNODE_API_URI =
  config.network === Network.Mainnet
    ? `${THORNODE_MAINNET_URL}/thorchain`
    : config.network === Network.Stagenet
    ? `${THORNODE_STAGENET_URL}/thorchain`
    : `${THORNODE_TESTNET_URL}/thorchain`;

const MIDGARD_API_URI = (url: string, network = Network.Testnet) =>
  network === Network.Mainnet
    ? `${MIDGARD_CHAOSNET_URL}/${url}`
    : network === Network.Stagenet
    ? `${MIDGARD_STAGENET_URL}/${url}`
    : `${MIDGARD_TESTNET_URL}/${url}`;

const thornodeAPI = (url: string) => `${THORNODE_API_URI}/${url}`;

// https://docs.thorchain.org/how-it-works/governance#mimir

export const getThorchainMimir = () => {
  return axios.get(thornodeAPI('mimir'));
};

export const getInboundData = (): Promise<
  AxiosResponse<InboundAddressesItem[]>
> => {
  return axios.get(
    MIDGARD_API_URI('v2/thorchain/inbound_addresses', config.network),
  );
};

export const getLiquidityProvider = ({
  asset,
  address,
}: {
  asset: string;
  address: string;
}): Promise<AxiosResponse<LiquidityProvider>> => {
  return axios.get(thornodeAPI(`pool/${asset}/liquidity_provider/${address}`));
};
