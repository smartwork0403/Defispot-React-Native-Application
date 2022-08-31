import {useCallback} from 'react';

import {FeeOption} from '@xchainjs/xchain-client';
import {Asset} from '../../SDKs/multichain-sdk';

// import {NotificationProps} from 'components/Notifications/Notifications';

import {
  actions,
  selectState as selectAppState,
} from '../../redux/app/app-slice';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';

import {multichain} from '../../services/multichain';
import type {Asset as AssetType} from '../../components/AssetsList';

export const useApp = () => {
  const dispatch = useAppDispatch();
  const appState = useAppSelector(selectAppState);
  console.log(appState, 'AppStateeeeeeeeeee');

  const baseCurrencyAsset =
    Asset.fromAssetString(appState.baseCurrency) || Asset.USD();
  console.log(baseCurrencyAsset, 'AppStateeeeeeeeeee');

  const setBaseCurrency = useCallback(
    (baseAsset: Asset) => {
      dispatch(actions.setBaseCurrency(baseAsset));
    },
    [dispatch],
  );

  const toggleSettings = useCallback(() => {
    dispatch(actions.toggleSettings());
  }, [dispatch]);

  const toggleFastSwap = useCallback(() => {
    dispatch(actions.toggleFastSwap());
  }, [dispatch]);

  const setTheme = useCallback(
    (theme: 'light' | 'dark') => {
      dispatch(actions.setTheme(theme));
    },
    [dispatch],
  );

  const setAssetsList = useCallback(
    (assets: {state: string; data: AssetType[]}) => {
      dispatch(actions.setAssetsList(assets));
    },
    [dispatch],
  );

  const closeFastSwap = useCallback(() => {
    if (appState.isFastSwapOpen) {
      dispatch(actions.toggleFastSwap());
    }
  }, [appState.isFastSwapOpen, dispatch]);

  const setSlippageTolerance = useCallback(
    (tolerance: number) => {
      dispatch(actions.setSlippageTolerance(tolerance));
    },
    [dispatch],
  );

  const setSlippage = useCallback(
    (slip: number) => {
      dispatch(actions.setSlippage(slip));
    },
    [dispatch],
  );

  const setFeeOptionType = useCallback(
    (feeOption: FeeOption) => {
      // set feeOption for multichain client
      multichain.setFeeOption(feeOption);
      dispatch(actions.setFeeOptionType(feeOption));
    },
    [dispatch],
  );

  const setReadStatus = useCallback(
    (readStatus: boolean) => {
      dispatch(actions.setReadStatus(readStatus));
    },
    [dispatch],
  );
  const setInputAsset = useCallback(
    (inputAsset: Asset) => {
      dispatch(actions.setInputAsset(inputAsset));
    },
    [dispatch],
  );
  const setOutputAsset = useCallback(
    (outputAsset: Asset) => {
      dispatch(actions.setOutputAsset(outputAsset));
    },
    [dispatch],
  );
  const setSendAsset = useCallback(
    (sendAsset: Asset) => {
      dispatch(actions.setSendAsset(sendAsset));
    },
    [dispatch],
  );
  const setWithdrawAsset = useCallback(
    (withdrawAsset: Asset) => {
      dispatch(actions.setWithdrawAsset(withdrawAsset));
    },
    [dispatch],
  );
  // const setNotification = useCallback(
  //   (notification: NotificationProps) => {
  //     dispatch(actions.setNotification(notification));
  //   },
  //   [dispatch],
  // );
  return {
    ...appState,
    FeeOption,
    baseCurrencyAsset,
    closeFastSwap,
    setBaseCurrency,
    toggleSettings,
    toggleFastSwap,
    setTheme,
    setAssetsList,
    setSlippageTolerance,
    setSlippage,
    setFeeOptionType,
    setReadStatus,
    setInputAsset,
    setOutputAsset,
    setSendAsset,
    setWithdrawAsset,
    // setNotification,
  };
};
