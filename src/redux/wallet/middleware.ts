import BigNumber from 'bignumber.js';
import {
  Amount,
  Price,
  Asset,
  SUPPORTED_CHAINS,
} from '../../SDKs/multichain-sdk';

// import {actions as AppActions} from '../app/app-slice';
import serverService from '../server/server.service';
import {
  setPortfolioGraphDataLoading,
  setPortfolioGraphData,
} from '../server/server.slice';

import * as walletActions from './actions';
import {actions} from './slice';

// TODO: Move this logic to an async thunk/slice
export const walletMiddleware = middlewareOptions => next => async action => {
  const {dispatch, getState} = middlewareOptions;
  const result = next(action);
  const {midgard} = getState();
  const pools = midgard.pools.map(pool => pool.pool);

  const convertedData = (priceData, assetAmounts, getTokenPriceInUSD) => {
    if (priceData && assetAmounts.length > 0) {
      const returnData = priceData.map(li => {
        const timeStamp = Object.keys(li)[0];

        const amountsWithPrices = assetAmounts
          .filter(assetAmount => assetAmount?.amount.gt(0))
          .map(assetAmount => {
            const asset = assetAmount?.asset;

            const TCPriceInUSD: Price = getTokenPriceInUSD(asset);
            const chain = asset?.L1Chain as string;
            const symbol = asset?.symbol?.includes('-')
              ? asset?.symbol?.split('-')[0]
              : asset?.symbol;
            let assetUSDPrice = TCPriceInUSD.price;
            let assetAmountUSD = TCPriceInUSD.price.multipliedBy(
              assetAmount ? assetAmount.assetAmount : 0,
            );
            if (asset) {
              const assetPrice = li[timeStamp][`${chain}.${symbol}`];
              assetUSDPrice = new BigNumber(assetPrice || 0);
              assetAmountUSD = assetUSDPrice.multipliedBy(
                assetAmount ? assetAmount.assetAmount : 0,
              );
            }
            return {
              assetAmountUSD,
            };
          });

        const totalGraphPrice = BigNumber.sum.apply(
          null,
          amountsWithPrices.map(item =>
            item.assetAmountUSD ? item.assetAmountUSD : 0,
          ),
        );
        return {
          timeStamp: new Date(Number(timeStamp) * 1),
          assetPriceUSD: totalGraphPrice.toFixed(4),
        };
      });

      return returnData;
    }
    return [];
  };
  // Transactions
  if (walletActions.loadAllWallets.fulfilled.match(action)) {
    // dispatch(
    //   AppActions.setNotification({
    //     type: 'success',
    //     text: 'Wallet is connected!',
    //   }),
    // );
    dispatch(setPortfolioGraphDataLoading(true));
    const wallet = action.payload;
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

    if (wallet) {
      const assetAmounts = SUPPORTED_CHAINS.map(
        chain => wallet[chain]?.balance,
      ).flat();
      const assetParams = assetAmounts
        .filter(assetAmount => assetAmount?.amount.gt(0))
        .map(assetAmount => {
          const asset = assetAmount?.asset;
          if (asset !== undefined) {
            return asset;
          }
          return [];
        })
        .flat();
      const priceDataByHour = await serverService.getAssetPriceDataByMinutes(
        60,
        assetParams,
      );
      const priceDataByDay = await serverService.getAssetPriceDataByHours(
        24,
        assetParams,
      );
      const priceDataByWeek = await serverService.getAssetPriceDataByDays(
        7,
        assetParams,
      );
      const priceDataByMonth = await serverService.getAssetPriceDataByDays(
        30,
        assetParams,
      );
      const priceDataByYear = await serverService.getAssetPriceDataByDays(
        365,
        assetParams,
      );
      const dataByHour = convertedData(
        priceDataByHour,
        assetAmounts,
        getTokenPriceInUSD,
      );
      const dataByDay = convertedData(
        priceDataByDay,
        assetAmounts,
        getTokenPriceInUSD,
      );
      const dataByWeek = convertedData(
        priceDataByWeek,
        assetAmounts,
        getTokenPriceInUSD,
      );
      const dataByMonth = convertedData(
        priceDataByMonth,
        assetAmounts,
        getTokenPriceInUSD,
      );
      const dataByYear = convertedData(
        priceDataByYear,
        assetAmounts,
        getTokenPriceInUSD,
      );
      dispatch(
        setPortfolioGraphData({
          dataByHour,
          dataByDay,
          dataByWeek,
          dataByMonth,
          dataByYear,
        }),
      );
      dispatch(setPortfolioGraphDataLoading(false));
    }
  }
  if (actions.disconnect.match(action)) {
    // dispatch(
    //   AppActions.setNotification({
    //     type: 'success',
    //     text: 'Wallet is disconnected!',
    //   }),
    // );
  }

  return result;
};
