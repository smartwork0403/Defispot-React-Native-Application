import {useMemo} from 'react';

import {Amount, Asset, Price, getAssetBalance} from '../SDKs/multichain-sdk';

import {useAppSelector} from '../redux/hooks';
import {selectAvailablePools} from '../redux/midgard/slice';

import {useWallet} from './useWallet';

export const useAsset = (asset: Asset, amount?: Amount) => {
  const {wallet} = useWallet();
  const pools = useAppSelector(selectAvailablePools);

  const tokenPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: asset,
        pools,
        priceAmount: Amount.fromAssetAmount(1, asset.decimal),
      }),
    [asset, pools],
  );

  const assetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: asset,
        pools,
        priceAmount: amount,
      }),
    [asset, amount, pools],
  );

  const balance: Amount = useMemo(() => {
    if (!wallet) {
      return Amount.fromAssetAmount(10 ** 3, 8);
    }

    return getAssetBalance(asset, wallet);
  }, [asset, wallet]);

  return {
    amount,
    balance,
    tokenPriceInUSD,
    assetPriceInUSD,
  };
};
