import {useCallback, useMemo} from 'react';

import {Chain} from '@xchainjs/xchain-util';
import {Asset} from '../../SDKs/multichain-sdk';

import {useAppDispatch, useAppSelector} from '../hooks';

import {useAssetPrices} from '../../hooks/useAssetPrices';

import * as actions from './server.actions';
import {
  isLoading,
  selectAssetsInfoMap,
  selectCurrentAssetPrice,
  selectIsLoadingAffiliate,
  selectMyAffiliateInfo,
  selectReferringAffiliateInfo,
} from './server.slice';

export const useServer = () => {
  const dispatch = useAppDispatch() as any;
  const loadingData = useAppSelector(isLoading);
  const assetPriceMap = useAppSelector(selectCurrentAssetPrice);
  const assetInfoMap = useAppSelector(selectAssetsInfoMap);
  const referringAffiliateInfo = useAppSelector(selectReferringAffiliateInfo);
  const myAffiliateInfo = useAppSelector(selectMyAffiliateInfo);
  const {getAssetPriceInUSDFromBaseValue} = useAssetPrices();
  const isLoadingAffiliate = useAppSelector(selectIsLoadingAffiliate);
  const affiliateFeesEarned = useMemo(() => {
    if (
      myAffiliateInfo &&
      myAffiliateInfo.balance &&
      myAffiliateInfo.balance.runeBaseAmount
    ) {
      return getAssetPriceInUSDFromBaseValue(
        Asset.RUNE(),
        myAffiliateInfo.balance.runeBaseAmount,
      );
    }
    return getAssetPriceInUSDFromBaseValue(Asset.RUNE(), 0);
  }, [getAssetPriceInUSDFromBaseValue, myAffiliateInfo]);

  const fetchAllAssets = useCallback(
    () => dispatch(actions.fetchAllAssets()),
    [dispatch],
  );

  const fetchCurrentAssetPriceData = useCallback(
    (assets: Asset[]) => dispatch(actions.getAssetCurrentPriceData(assets)),
    [dispatch],
  );

  const findAssetsByChain = useCallback(
    (chain: Chain) => dispatch(actions.findAssetsByChain(chain)),
    [dispatch],
  );
  const findAssetsByChainAndGetBalances = useCallback(
    (chain: Chain) => dispatch(actions.findAssetsByChainAndGetBalances(chain)),
    [dispatch],
  );

  // const findMyAffiliateInfo = useCallback(
  //   (referralCode: string) =>
  //     dispatch(actions.findMyAffiliateInfo(referralCode)),
  //   [dispatch],
  // )
  const findReferringAffiliateInfo = useCallback(
    (referralCode: string) =>
      dispatch(actions.findReferringAffiliateInfo(referralCode)),
    [dispatch],
  );

  return {
    fetchAllAssets,
    findAssetsByChain,
    findAssetsByChainAndGetBalances,
    fetchCurrentAssetPriceData,
    // findMyAffiliateInfo,
    findReferringAffiliateInfo,
    isLoadingAffiliate,
    affiliateFeesEarned,
    referringAffiliateInfo,
    myAffiliateInfo,
    loadingData,
    assetPriceMap,
    assetInfoMap,
  };
};
