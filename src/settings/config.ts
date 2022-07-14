import {ClientUrl} from '@xchainjs/xchain-bitcoincash';
import {Network} from '@xchainjs/xchain-client';

const safeEnv = (defaultEnv: string, env?: string) => {
  return env || defaultEnv;
};

export type Config = {
  network: Network;
  apiV1Url: string | undefined;
  apiV2Url: string | undefined;
  affiliateAddress: string | undefined;
};
export type ENV = string;

export const isEnv = (env: ENV | undefined): env is ENV => !!env;

/**
 * Returns a given ENV if it's valid only or returns a default value
 * @param env {string} ENV
 * @param defaultValue {string} Default value
 */
export const envOrDefault = (env: ENV | undefined, defaultValue: string) =>
  isEnv(env) ? env : defaultValue;

const APP_HASKOIN_BCH_MAINNET_URL = envOrDefault(
  process.env.REACT_APP_HASKOIN_BCH_MAINNET_URL,
  'https://haskoin.ninerealms.com/bch',
);

export const HASKOIN_API_URL: ClientUrl = {
  testnet: envOrDefault(
    process.env.REACT_APP_HASKOIN_BCH_TESTNET_URL,
    'https://haskoin.ninerealms.com/bchtest',
  ),
  stagenet: APP_HASKOIN_BCH_MAINNET_URL,
  mainnet: APP_HASKOIN_BCH_MAINNET_URL,
};
export const getBlockcypherUrl = (): string =>
  envOrDefault(
    process.env.REACT_APP_BLOCKCYPHER_URL,
    'https://api.blockcypher.com/v1',
  );

export const getSochainUrl = (): string =>
  envOrDefault(process.env.REACT_APP_SOCHAIN_URL, 'https://sochain.com/api/v2');

export const IS_TESTNET =
  safeEnv('testnet', process.env.REACT_APP_NETWORK) === 'testnet';

export const IS_SYNTH_ACTIVE =
  safeEnv('testnet', process.env.REACT_APP_IS_SYNTH_ACTIVE) === 'true';

export const {REACT_APP_MOCK_PHRASE} = process.env;

export const config: Config = {
  network: safeEnv('testnet', process.env.REACT_APP_NETWORK) as Network,
  apiV1Url: process.env.REACT_APP_API_V1_URL,
  apiV2Url: process.env.REACT_APP_API_V2_URL,
  affiliateAddress: IS_TESTNET
    ? process.env.REACT_APP_AFFILIATE_ADDRESS_TESTNET
    : process.env.REACT_APP_AFFILIATE_ADDRESS_MAINNET,
};

if (!config.apiV1Url) {
  throw new Error(
    '[error]: The "REACT_APP_API_V1_URL" environment variable is required',
  );
}
