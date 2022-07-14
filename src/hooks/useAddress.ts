import {useMemo} from 'react';

import {Asset} from '../SDKs/multichain-sdk';

import {useAppSelector} from '../redux/hooks';
import {selectConnectedWallets} from '../redux/wallet/slice';

import {multichain} from '../services/multichain';

// TODO: Review all ways a user could potentially swap to the wrong address. (also, BCH breaks if passed an invalid address)
export const useAddress = (address?: string, asset?: Asset) => {
  const wallets = useAppSelector(selectConnectedWallets);

  const connectedAddresses = useMemo(
    () => wallets?.map(w => w.address).join(','),
    [wallets],
  );

  const isValidAddress = useMemo(() => {
    if (!address || !asset) {
      return false;
    }
    try {
      return address
        ? multichain.validateAddress({
            chain: asset.L1Chain,
            address,
          })
        : false;
    } catch (err) {
      return false;
    }
  }, [address, asset]);

  return {isValidAddress, connectedAddresses};
};
