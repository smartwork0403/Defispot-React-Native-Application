import {useCallback, useMemo} from 'react';

import {unwrapResult} from '@reduxjs/toolkit';
import {THORChain} from '@xchainjs/xchain-util';
import {
  Action,
  ActionListParams,
  ActionStatusEnum,
  ActionTypeEnum,
  HistoryInterval,
} from '../../SDKs/midgard-sdk';
import {Asset, SupportedChain} from '../../SDKs/multichain-sdk';

import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import * as actions from '../../redux/midgard/actions';
import {
  actions as sliceActions,
  selectPools,
  selectState as selectMidgardState,
} from '../../redux/midgard/slice';
import * as walletActions from '../../redux/wallet/actions';
import {selectState as selectWalletState} from '../../redux/wallet/slice';

import {useAddress} from '../../hooks/useAddress';

import {TX_PUBLIC_PAGE_LIMIT} from '../../settings/constants/global';

import {SubmitTx, TxTracker, TxTrackerStatus, TxTrackerType} from './types';

const MAX_HISTORY_COUNT = 100;
const PER_DAY = 'day' as HistoryInterval;

export const useMidgard = () => {
  const dispatch = useAppDispatch() as any;
  const midgardState = useAppSelector(selectMidgardState);
  const walletState = useAppSelector(selectWalletState);
  const wallet = useMemo(() => walletState.wallet, [walletState]);
  const pools = useAppSelector(selectPools);

  const {connectedAddresses} = useAddress();

  const isGlobalHistoryLoading = useMemo(
    () =>
      midgardState.earningsHistoryLoading ||
      midgardState.swapHistoryLoading ||
      midgardState.liquidityHistoryLoading,
    [midgardState],
  );

  // get earnings, swap, liquidity history
  const getGlobalHistory = useCallback(() => {
    // fetch historical data till past day
    const query = {
      interval: PER_DAY,
      count: MAX_HISTORY_COUNT,
    };

    dispatch(actions.getEarningsHistory(query));
    dispatch(actions.getTVLHistory(query));
    dispatch(actions.getSwapHistory({query}));
    dispatch(actions.getLiquidityHistory({query}));
  }, [dispatch]);

  const getPoolHistory = useCallback(
    (pool: string) => {
      // fetch historical data till past day

      const query = {
        pool,
        query: {
          interval: PER_DAY,
          count: MAX_HISTORY_COUNT,
        },
      };
      dispatch(actions.getSwapHistory(query));
      dispatch(actions.getDepthHistory(query));
      dispatch(actions.getLiquidityHistory(query));
    },
    [dispatch],
  );

  // get tx data
  const getTxData = useCallback(
    (params: Omit<ActionListParams, 'limit'>) => {
      dispatch(
        actions.getActions({
          ...params,
          limit: TX_PUBLIC_PAGE_LIMIT,
        }),
      );
    },
    [dispatch],
  );

  /**
   * reload pool member details for a specific chain
   * 1. fetch pool member data for chain wallet addr (asset asymm share, symm share)
   * 2. fetch pool member data for thorchain wallet addr (rune asymm share)
   */
  const loadMemberDetailsByChain = useCallback(
    (chain: SupportedChain) => {
      if (!wallet) {
        return;
      }

      const assetChainAddress = wallet?.[chain]?.address;
      const thorchainAddress = wallet?.[THORChain]?.address;
      if (assetChainAddress && thorchainAddress) {
        dispatch(
          actions.reloadPoolMemberDetailByChain({
            chain,
            thorchainAddress,
            assetChainAddress,
          }),
        );
      }
    },
    [dispatch, wallet],
  );

  // get pool member details for a specific chain
  const getMemberDetailsByChain = useCallback(
    (chain: SupportedChain) => {
      if (!wallet) {
        return;
      }

      const chainWalletAddr = wallet?.[chain]?.address;

      if (chainWalletAddr) {
        dispatch(
          actions.getPoolMemberDetailByChain({
            chain,
            address: chainWalletAddr,
          }),
        );
      }
    },
    [dispatch, wallet],
  );

  // get pool member details for all chains
  const getAllMemberDetails = useCallback(() => {
    if (!wallet) {
      return;
    }

    Object.keys(wallet).forEach(chain => {
      getMemberDetailsByChain(chain as SupportedChain);
    });
  }, [getMemberDetailsByChain, wallet]);

  const addNewTxTracker = useCallback(
    (txTracker: TxTracker) => {
      dispatch(sliceActions.addNewTxTracker(txTracker));
    },
    [dispatch],
  );

  const updateTxTracker = useCallback(
    ({uuid, txTracker}: {uuid: string; txTracker: Partial<TxTracker>}) => {
      dispatch(sliceActions.updateTxTracker({uuid, txTracker}));
    },
    [dispatch],
  );

  // process tx tracker to update balance after submit
  // update sent asset balance after submit
  const processSubmittedTx = useCallback(
    ({submitTx, type}: {submitTx: SubmitTx; type: TxTrackerType}) => {
      if (type === TxTrackerType.Swap || type === TxTrackerType.Switch) {
        const inAsset = submitTx?.inAssets?.[0];
        if (inAsset) {
          const asset = Asset.fromAssetString(inAsset?.asset);

          if (asset) {
            dispatch(
              walletActions.getWalletByChain({
                chain: asset.chain as SupportedChain,
              }),
            );
          }
        }
      } else if (type === TxTrackerType.AddLiquidity) {
        const inAssets = submitTx?.inAssets ?? [];
        inAssets.forEach(inAsset => {
          const asset = Asset.fromAssetString(inAsset?.asset);

          if (asset) {
            dispatch(
              walletActions.getWalletByChain({
                chain: asset.chain as SupportedChain,
              }),
            );
          }
        });
      }
    },
    [dispatch],
  );

  // process tx tracker to update balance after success
  const processTxTracker = useCallback(
    ({txTracker, action}: {txTracker: TxTracker; action?: Action}) => {
      // update received asset balance after success
      if (action?.status === ActionStatusEnum.Success) {
        if (action.type === ActionTypeEnum.Swap) {
          const inTx = action.in[0];
          const inAsset = Asset.fromAssetString(inTx?.coins?.[0]?.asset);
          const outTx = action.out[0];
          const outAsset = Asset.fromAssetString(outTx?.coins?.[0]?.asset);

          if (inAsset) {
            dispatch(
              walletActions.getWalletByChain({
                chain: inAsset.chain as SupportedChain,
              }),
            );
          }

          if (outAsset) {
            dispatch(
              walletActions.getWalletByChain({
                chain: outAsset.chain as SupportedChain,
              }),
            );
          }
        } else if (
          action.type === ActionTypeEnum.AddLiquidity ||
          action.type === ActionTypeEnum.Withdraw
        ) {
          const inAssets = txTracker.submitTx?.inAssets ?? [];
          const outAssets = txTracker.submitTx?.outAssets ?? [];

          inAssets.forEach(inAsset => {
            const asset = Asset.fromAssetString(inAsset.asset);

            if (asset) {
              dispatch(
                walletActions.getWalletByChain({
                  chain: asset.chain as SupportedChain,
                }),
              );
              getMemberDetailsByChain(asset.chain as SupportedChain);
            }
          });
          outAssets.forEach(outAsset => {
            const asset = Asset.fromAssetString(outAsset.asset);

            if (asset) {
              dispatch(
                walletActions.getWalletByChain({
                  chain: asset.chain as SupportedChain,
                }),
              );
              getMemberDetailsByChain(asset.chain as SupportedChain);
            }
          });
        } else if (action.type === ActionTypeEnum.Switch) {
          dispatch(walletActions.getWalletByChain({chain: THORChain}));
        }
        dispatch(sliceActions.addAction({txTracker, action}));
        dispatch(actions.fetchAllMemberDetails(connectedAddresses || ''));
      } else if (action?.type === ActionTypeEnum.Refund) {
        dispatch(
          sliceActions.updateTxTracker({
            uuid: txTracker.uuid,
            txTracker: {
              ...txTracker,
              refunded: true,
              status: TxTrackerStatus.Success,
            },
          }),
        );
        dispatch(sliceActions.addAction({txTracker, action}));
        dispatch(actions.fetchAllMemberDetails(connectedAddresses || ''));
      }
    },
    [dispatch, getMemberDetailsByChain, connectedAddresses],
  );

  const pollTx = useCallback(
    (txTracker: TxTracker) => {
      dispatch(actions.pollTx(txTracker))
        .then(unwrapResult)
        .then(response =>
          processTxTracker({
            txTracker,
            action: response?.actions?.[0],
          }),
        );
    },
    [dispatch, processTxTracker],
  );

  const pollApprove = useCallback(
    (txTracker: TxTracker) => {
      dispatch(actions.pollApprove(txTracker));
    },
    [dispatch],
  );

  const clearTxTrackers = useCallback(() => {
    dispatch(sliceActions.clearTxTrackers());
  }, [dispatch]);

  const setTxCollapsed = useCallback(
    (collapsed: boolean) => {
      dispatch(sliceActions.setTxCollapsed(collapsed));
    },
    [dispatch],
  );

  const getInboundData = useCallback(() => {
    dispatch(actions.getThorchainInboundData());
  }, [dispatch]);

  return {
    ...midgardState,
    pools,
    actions,
    isGlobalHistoryLoading,
    getPoolHistory,
    getGlobalHistory,
    getTxData,
    getAllMemberDetails,
    getMemberDetailsByChain,
    loadMemberDetailsByChain,
    addNewTxTracker,
    updateTxTracker,
    clearTxTrackers,
    setTxCollapsed,
    pollTx,
    pollApprove,
    processSubmittedTx,
    getInboundData,
  };
};
