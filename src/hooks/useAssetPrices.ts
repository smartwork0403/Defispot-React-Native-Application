import {Amount, Asset, getAssetBalance, Price} from '../SDKs/multichain-sdk';

import {useAppSelector} from '../redux/hooks';
import {selectAvailablePools} from '../redux/midgard/slice';

import {useWallet} from './useWallet';

export const useAssetPrices = () => {
  const {wallet} = useWallet();
  const pools = useAppSelector(selectAvailablePools);

  const getTokenPriceInUSD = (asset?: Asset) =>
    asset
      ? new Price({
          baseAsset: asset,
          pools,
          priceAmount: Amount.fromAssetAmount(1, asset.decimal),
        })
      : new Price({
          baseAsset: Asset.RUNE(),
          pools,
          priceAmount: Amount.fromAssetAmount(0, 8),
        });

  const getAssetPriceInUSD = (asset?: Asset) =>
    asset
      ? new Price({
          baseAsset: asset,
          pools,
          priceAmount: wallet
            ? getAssetBalance(asset, wallet)
            : Amount.fromAssetAmount(0, 8),
        })
      : new Price({
          baseAsset: Asset.RUNE(),
          pools,
          priceAmount: Amount.fromAssetAmount(0, 8),
        });

  const getAssetPriceInUSDFromBaseValue = (asset: Asset, value: number) =>
    new Price({
      baseAsset: asset,
      pools,
      priceAmount: Amount.fromBaseAmount(value, asset.decimal),
    });

  return {
    getTokenPriceInUSD,
    getAssetPriceInUSD,
    getAssetPriceInUSDFromBaseValue,
  };
};
