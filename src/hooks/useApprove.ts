import {useEffect, useState, useMemo} from 'react';

import {Asset} from '../SDKs/multichain-sdk';

import {useMidgard} from '../redux/midgard/hooks';
import {TxTrackerStatus} from '../redux/midgard/types';

import {multichain} from '../services/multichain';

import {useWallet} from './useWallet';

export const useApprove = (asset: Asset, hasWallet = true) => {
  const {approveStatus} = useMidgard();
  const {isConnected} = useWallet();
  const [isApproved, setApproved] = useState<boolean | null>(
    hasWallet ? null : true,
  );

  useEffect(() => {
    if (!hasWallet || !isConnected) {
      setApproved(true);
      return;
    }

    const checkApproved = async () => {
      if (approveStatus?.[asset.toString()] === TxTrackerStatus.Success) {
        setApproved(true);
      }
      const approved = await multichain.isAssetApproved(asset);
      setApproved(approved);
    };

    checkApproved();
  }, [asset, approveStatus, hasWallet, isConnected]);

  const assetApproveStatus = useMemo(
    () => approveStatus?.[asset.toString()],
    [approveStatus, asset],
  );

  return {
    assetApproveStatus,
    isApproved,
  };
};
