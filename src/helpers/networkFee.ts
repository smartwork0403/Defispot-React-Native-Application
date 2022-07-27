import {FeeOption} from '@thorwallet/xchain-client';
import {Chain} from '@thorwallet/xchain-util';
import {InboundAddressesItem} from '../SDKs/midgard-sdk';

const multiplier: Record<FeeOption, number> = {
  average: 0.67,
  fast: 1,
  fastest: 1.5,
};

// Reference issue: https://github.com/thorchain/asgardex-electron/issues/1381
export const getGasRateByChain = ({
  inboundData,
  chain,
}: {
  inboundData: InboundAddressesItem[];
  chain: Chain;
}): number => {
  const chainInboundData = inboundData.find(data => data.chain === chain);

  return Number(chainInboundData?.gas_rate ?? 0);
};

export const getGasRateByFeeOption = ({
  inboundData,
  chain,
  feeOptionType,
}: {
  inboundData: InboundAddressesItem[];
  chain: Chain;
  feeOptionType: FeeOption;
}) => {
  return getGasRateByChain({inboundData, chain}) * multiplier[feeOptionType];
};
