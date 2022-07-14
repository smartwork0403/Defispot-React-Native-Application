import {THORChain} from '@xchainjs/xchain-util';
import {MemberPool} from '../../SDKs/midgard-sdk';
import * as moment from 'moment';
import {SupportedChain} from '../../SDKs/multichain-sdk';

import {
  ChainMemberDetails,
  ChainMemberData,
  PoolMemberData,
  LiquidityProvider,
} from './types';

export const getPastDay = () => {
  return moment()
    .subtract(1, 'days')
    .set({
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
    })
    .unix();
};

export const getChainMemberDetails = ({
  chain,
  memPools,
  chainMemberDetails,
}: {
  chain: SupportedChain;
  memPools: MemberPool[];
  chainMemberDetails: ChainMemberDetails;
}): ChainMemberDetails => {
  // get rune asym share from memPools fetched with thorchain address
  if (chain === THORChain) {
    memPools.forEach((memPool: MemberPool) => {
      const {pool, runeAdded, assetAdded} = memPool;

      const poolChain = pool.split('.')[0] as SupportedChain;
      let chainMemberData: ChainMemberData =
        chainMemberDetails?.[poolChain] ?? {};
      let poolMemberData: PoolMemberData = chainMemberData?.[pool] ?? {};

      // get rune asymm share & sym share
      if (Number(assetAdded) === 0 && Number(runeAdded) > 0) {
        poolMemberData = {
          ...poolMemberData,
          runeAsym: memPool,
        };

        chainMemberData = {
          ...chainMemberData,
          [pool]: poolMemberData,
        };

        chainMemberDetails[poolChain] = chainMemberData;
      } else if (Number(runeAdded) > 0 && Number(assetAdded) > 0) {
        // sym share
        poolMemberData = {
          ...poolMemberData,
          sym: memPool,
        };

        chainMemberData = {
          ...chainMemberData,
          [pool]: poolMemberData,
        };

        chainMemberDetails[poolChain] = chainMemberData;
      }
    });
  }

  // get only asset asym share
  if (chain !== THORChain) {
    memPools.forEach((memPool: MemberPool) => {
      const {pool, runeAdded, assetAdded} = memPool;

      const poolChain = pool.split('.')[0] as SupportedChain;
      let chainMemberData: ChainMemberData =
        chainMemberDetails?.[poolChain] ?? {};
      let poolMemberData: PoolMemberData = chainMemberData?.[pool] ?? {};

      // check asset asymm share
      if (Number(runeAdded) === 0 && Number(assetAdded) > 0) {
        poolMemberData = {
          ...poolMemberData,
          assetAsym: memPool,
        };

        chainMemberData = {
          ...chainMemberData,
          [pool]: poolMemberData,
        };

        chainMemberDetails[poolChain] = chainMemberData;
      }
    });
  }

  return chainMemberDetails;
};

export const isPendingLP = (data: LiquidityProvider): boolean => {
  if (Number(data.pending_asset) > 0 || Number(data.pending_rune) > 0) {
    return true;
  }

  return false;
};
