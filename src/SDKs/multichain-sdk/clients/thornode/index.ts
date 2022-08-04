import {Network} from '@thorwallet/xchain-client';

import {getInboundData} from './api';
import {InboundAddressesItem} from './types';

export const getInboundDataByChain = async (
  chain: string,
  network: Network,
): Promise<InboundAddressesItem> => {
  try {
    const {data: inboundData} = await getInboundData(network);
    const addresses = inboundData || [];

    const chainAddressData = addresses.find(
      (item: InboundAddressesItem) => item.chain === chain,
    );

    if (chainAddressData) {
      return chainAddressData;
    }

    throw new Error('pool address not found');
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getInboundDataArray = async (
  network: Network,
): Promise<InboundAddressesItem[]> => {
  try {
    const {data: inboundData} = await getInboundData(network);
    return inboundData || [];
  } catch (error) {
    return Promise.reject(error);
  }
};
