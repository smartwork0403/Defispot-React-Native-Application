import {useEffect} from 'react';

import ReactGA from 'react-ga4';

import {Asset} from '../SDKs/multichain-sdk';

import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {useMidgard} from '../redux/midgard/hooks';
import {selectAvailableThorchainAssetAmounts} from '../redux/midgard/slice';
import {
  fetchAllAssets,
  getAssetMetadata,
  getFluctuationsLast24Hrs,
} from '../redux/server/server.actions';
import {useServer} from '../redux/server/server.hooks';

import {useAddress} from '../hooks/useAddress';
import useInterval from '../hooks/useInterval';

import {
  POLL_GAS_RATE_INTERVAL,
  POLL_DATA_INTERVAL,
  POLL_CMC_CURRENT_PRICES_INTERVAL,
} from '../settings/constants';

import {useGlobalState} from './useGlobalState';
import {useWallet} from './useWallet';

/**
 * hooks for reloading all data
 * NOTE: useRefresh hooks should be imported and used only once, to avoid multiple usage of useInterval
 */
export const useGlobalRefresh = async () => {
  // console.log('=========-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=');
  const dispatch = useAppDispatch();
  // console.log('=========-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=');

  const {getInboundData, getGlobalHistory, assets, pools} = useMidgard();
  // console.log('=========-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=3', pools);

  const {fetchCurrentAssetPriceData} = useServer();
  // console.log('=========-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=4', pools);

  const {refreshPage} = useGlobalState();
  // console.log('=========-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=5', pools);

  const {getTxData} = useMidgard();
  const {isConnected, wallet} = useWallet();
  const {connectedAddresses} = useAddress();
  // console.log(
  //   'connectedAddresses=========-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=',
  // );

  const assetAmounts = useAppSelector(selectAvailableThorchainAssetAmounts);

  useEffect(() => {
    refreshPage();
    // TODO: Make sure this global history is still used anywhere in the project, otherwise drop it
    getGlobalHistory();
  }, [getGlobalHistory, refreshPage]);

  // useEffect(() => {
  //   const gtmId = process.env.REACT_APP_GOOGLE_TARGET_MANAGER_ID;
  //   if (gtmId) {
  //     ReactGA.initialize(gtmId);
  //     ReactGA.send('pageview');
  //   }
  // }, []);

  useEffect(() => {
    dispatch(getFluctuationsLast24Hrs());
    dispatch(getAssetMetadata());
    dispatch(fetchAllAssets());
  }, [dispatch]);

  // TODO: Refactor this useEffect. The intention was to fetch the latest prices for assets within the wallet.
  // The useEffect in this case satisfies that requirement, however, it is causing unnecessary re-renders by using
  // a selector. A better approach would be to dispatch an action to fetch the prices upon wallet connect, so that
  // way the prices would just fetch once on wallet events.
  useEffect(() => {
    if (isConnected) {
      const assetList = assetAmounts.map(item => item?.asset);
      fetchCurrentAssetPriceData(assetList as Asset[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCurrentAssetPriceData, isConnected]);

  useEffect(() => {
    fetchCurrentAssetPriceData([...assets, Asset.RUNE()]);
  }, [fetchCurrentAssetPriceData, assets]);

  useEffect(() => {
    if (isConnected) {
      getTxData({
        address: connectedAddresses,
        offset: 0,
      });
    }
  }, [connectedAddresses, isConnected, getTxData]);

  useInterval(() => {
    getInboundData();
  }, POLL_GAS_RATE_INTERVAL);

  useInterval(() => {
    getInboundData();
    refreshPage();
  }, POLL_DATA_INTERVAL);

  useInterval(() => {
    if (wallet && isConnected) {
      const assetList = assetAmounts.map(item => item?.asset);
      fetchCurrentAssetPriceData(assetList as Asset[]);
    } else {
      const assetList = pools.map(p => p.asset);
      fetchCurrentAssetPriceData([...assetList, Asset.RUNE()]);
    }
  }, POLL_CMC_CURRENT_PRICES_INTERVAL);
};
