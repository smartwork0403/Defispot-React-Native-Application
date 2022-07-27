import {
  BTCChain,
  BNBChain,
  THORChain,
  ETHChain,
  LTCChain,
  BCHChain,
  DOGEChain,
} from '@thorwallet/xchain-util';

// TODO: Determine if these are even being used
export const blockReward = {
  [BTCChain]: 6.5,
  [BCHChain]: 6.25,
  [LTCChain]: 12.5,
  [ETHChain]: 3,
  [BNBChain]: 0,
  [THORChain]: 0,
  [DOGEChain]: 10000,
};

// time secs for 1 block confirmation
export const blockTime = {
  [BTCChain]: 600,
  [BCHChain]: 600,
  [LTCChain]: 150,
  [ETHChain]: 15,
  [BNBChain]: 0,
  [THORChain]: 0,
  [DOGEChain]: 60,
};
