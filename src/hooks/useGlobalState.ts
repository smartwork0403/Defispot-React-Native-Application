import {useCallback, useEffect} from 'react';

import {Amount, Asset, Price, runeToAsset} from '../SDKs/multichain-sdk';

import {useMidgard} from '../redux/midgard/hooks';

import {useApp} from '../redux/app/hooks';
import {useAppDispatch} from '../redux/hooks';

export const useGlobalState = () => {
  const dispatch = useAppDispatch();
  const {actions, pools} = useMidgard();
  const {baseCurrency} = useApp();
  const loadInitialData = useCallback(() => {
    console.log(actions);
    dispatch(actions.getVolume24h());
    dispatch(actions.getPools());
    dispatch(actions.getStats());
    dispatch(actions.getNetworkData());
    dispatch(actions.getLastblock());
    dispatch(actions.getMimir());
    dispatch(actions.getQueue());
  }, [dispatch, actions]);

  const refreshPage = useCallback(() => {
    loadInitialData();
  }, [loadInitialData]);

  const runeToCurrency = useCallback(
    (runeAmount: Amount): Price => {
      const quoteAsset = Asset.fromAssetString(baseCurrency);

      return runeToAsset({
        runeAmount,
        quoteAsset,
        pools,
      });
    },
    [baseCurrency, pools],
  );

  return {
    runeToCurrency,
    refreshPage,
  };
};
