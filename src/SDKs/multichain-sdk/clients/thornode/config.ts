import {Network} from '@xchainjs/xchain-client';

import {
  MIDGARD_CHAOSNET_URL,
  MIDGARD_STAGENET_URL,
  MIDGARD_TESTNET_URL,
  THORNODE_MAINNET_URL,
  THORNODE_STAGENET_URL,
  THORNODE_TESTNET_URL,
} from '../../../midgard-sdk/config';

export const thornodeAPI = (url: string, network = Network.Testnet) =>
  `${
    network === Network.Mainnet
      ? THORNODE_MAINNET_URL
      : network === Network.Stagenet
      ? THORNODE_STAGENET_URL
      : THORNODE_TESTNET_URL
  }/thorchain/${url}`;

export const midgardAPI = (url: string, network = Network.Testnet) =>
  `${
    network === Network.Mainnet
      ? MIDGARD_CHAOSNET_URL
      : network === Network.Stagenet
      ? MIDGARD_STAGENET_URL
      : MIDGARD_TESTNET_URL
  }/${url}`;
