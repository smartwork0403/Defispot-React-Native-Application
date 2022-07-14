import {useCallback} from 'react';

import {
  Asset,
  Amount,
  getAssetBalance,
  NetworkFee,
  Price,
} from '../SDKs/multichain-sdk';

import {SupportedChain} from '../SDKs/multichain-sdk/clients/types';

import {selectState as selectAppState} from '../redux/app/app-slice';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  selectAvailablePools,
  selectState as selectMidgardState,
} from '../redux/midgard/slice';
import {AssetBalance} from '../redux/midgard/types';
import * as walletActions from '../redux/wallet/actions';
import {selectState as selectWalletState} from '../redux/wallet/slice';

import {getGasRateByFeeOption} from '../helpers/networkFee';

export const useBalance = () => {
  const dispatch = useAppDispatch();
  const {feeOptionType} = useAppSelector(selectAppState);
  const {wallet} = useAppSelector(selectWalletState);
  const {inboundData} = useAppSelector(selectMidgardState);
  const pools = useAppSelector(selectAvailablePools);

  const reloadBalanceByChain = useCallback(
    (chain: SupportedChain) => {
      dispatch(walletActions.getWalletByChain({chain}));
    },
    [dispatch],
  );

  const reloadAllBalance = useCallback(() => {
    dispatch(walletActions.loadAllWallets());
  }, [dispatch]);

  const getPriceInUSD = useCallback(
    (asset: Asset, amount: Amount) =>
      new Price({
        baseAsset: asset,
        pools,
        priceAmount: amount,
      }),
    [pools],
  );

  const getMaxBalance = useCallback(
    (asset: Asset): Amount => {
      if (!wallet?.[asset.L1Chain as SupportedChain]) {
        // allow max amount for emulation if wallet is not connected
        return Amount.fromAssetAmount(0, 8);
      }

      // calculate inbound fee
      const gasRate = getGasRateByFeeOption({
        inboundData,
        chain: asset.L1Chain,
        feeOptionType,
      });
      const inboundFee = NetworkFee.getNetworkFeeByAsset({
        asset,
        gasRate,
        direction: 'inbound',
      });
      const balance = getAssetBalance(asset, wallet).amount;

      /**
       * if asset is used for gas, subtract the inbound gas fee from input amount
       * else allow full amount
       * Calc: max spendable amount = balance amount - 2 x gas fee(if send asset equals to gas asset)
       */

      const maxSpendableAmount = asset.isGasAsset()
        ? balance.sub(inboundFee.mul(1.5).amount)
        : balance;
      if (maxSpendableAmount.gt(0)) {
        return maxSpendableAmount;
      }

      return Amount.fromAssetAmount(0, asset.decimal);
    },
    [wallet, feeOptionType, inboundData],
  );

  const getAssetBalanceList = useCallback(
    (assetList: Asset[]): AssetBalance[] =>
      assetList.map(asset => {
        if (!wallet) {
          return {
            asset,
            balance: Amount.fromAssetAmount(0, 8),
            priceUsd: new Price({
              baseAsset: asset,
              pools,
            }),
          };
        }
        const amount = getAssetBalance(asset, wallet);
        const priceUsd = getPriceInUSD(asset, amount);

        return {
          asset,
          balance: amount,
          priceUsd,
        };
      }),
    [getPriceInUSD, pools, wallet],
  );

  return {
    getMaxBalance,
    getAssetBalanceList,
    reloadAllBalance,
    reloadBalanceByChain,
  };
};
