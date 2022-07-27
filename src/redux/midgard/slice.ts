import {createSelector, createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {Chain, THORChain} from '@thorwallet/xchain-util';
import BigNumber from 'bignumber.js';
import {getFormatted} from '../../common/helper/action-helper';
import {fromUnixTime} from 'date-fns';
import {
  Action,
  ActionStatusEnum,
  ActionTypeEnum,
  MemberPool,
  Transaction,
} from '../../SDKs/midgard-sdk';
import * as moment from 'moment';
import {Asset, Pool, SUPPORTED_CHAINS} from '../../SDKs/multichain-sdk';

import {getAssetCurrentPriceData} from '../../redux/server/server.actions';
import {actions as walletActions} from '../../redux/wallet/slice';

import type {RootState} from '../store';
import * as midgardActions from './actions';
import {
  AssetApproval,
  LpChartData,
  MemberDetailsPositionStats,
  PoolMarketCap,
  PortfolioOverview,
  State,
  TxTracker,
  TxTrackerStatus,
} from './types';
import {getChainMemberDetails, isPendingLP} from './utils';

const initialState: State = {
  assets: [],
  pools: [],
  poolLoading: true,
  isLpChartLoading: false,
  memberDetails: {
    pools: [],
  },
  memberDetailsLoading: false,
  memberDetailsLiquidityStats: [],
  memberDetailsPositionStats: [],
  chainMemberDetails: {},
  chainMemberDetailsLoading: {},
  stats: null,
  networkData: null,
  constants: null,
  queue: null,
  poolStats: null,
  poolStatsLoading: false,
  depthHistory: null,
  depthHistoryLoading: false,
  earningsHistory: null,
  earningsHistoryLoading: false,
  tvlHistory: null,
  tvlHistoryLoading: false,
  swapHistory: null,
  swapGlobalHistory: null,
  swapHistoryLoading: false,
  liquidityHistory: null,
  liquidityGlobalHistory: null,
  liquidityHistoryLoading: false,
  liquidityChartData: [],
  lpChartCurrentValueChange: new BigNumber(0),
  txData: {
    actions: [],
    count: '0',
  },
  lpPositions: [],
  txActions: [],
  txDataLoading: false,
  txTrackers: [],
  newTxTrackers: [],
  txCollapsed: true,
  mimirLoading: false,
  mimir: {},
  approveStatus: {},
  volume24h: null,
  inboundData: [],
  pendingLP: {},
  pendingLPLoading: false,
  lastBlock: [],
  assetApprovals: [],
};

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addNewTxTracker(state, action: PayloadAction<TxTracker>) {
      state.txTrackers = [...state.txTrackers, action.payload];
      state.txCollapsed = false;
    },
    updateTxTracker(
      state,
      action: PayloadAction<{uuid: string; txTracker: Partial<TxTracker>}>,
    ) {
      const {uuid, txTracker} = action.payload;

      state.txTrackers = state.txTrackers.map((tracker: TxTracker) => {
        if (tracker.uuid === uuid) {
          return {
            ...tracker,
            ...txTracker,
          };
        }

        return tracker;
      });
    },
    clearTxTrackers(state) {
      state.txTrackers = [];
    },
    setTxCollapsed(state, action: PayloadAction<boolean>) {
      state.txCollapsed = action.payload;
    },
    updateMemberPosition(
      state,
      {payload}: PayloadAction<MemberDetailsPositionStats>,
    ) {
      const index = state.memberDetailsPositionStats.findIndex(
        position => position.pool === payload.pool,
      );
      if (index !== -1) {
        state.memberDetailsPositionStats[index] = payload;
      } else {
        state.memberDetailsPositionStats.push(payload);
      }
    },
    addAction(
      state,
      {payload}: PayloadAction<{txTracker: TxTracker; action?: Action}>,
    ) {
      const {txTracker, action} = payload;
      if (!action) {
        return;
      }

      const existingTracker = state.newTxTrackers.find(
        tx => tx.uuid === txTracker.uuid,
      );

      if (!existingTracker) {
        state.txData.actions.push(action);
        state.txData.count = (+state.txData.count + 1).toString();
        state.newTxTrackers.push(txTracker);
        state.memberDetails.pools = [];
        state.memberDetailsLiquidityStats = [];
        state.memberDetailsPositionStats = [];
        state.liquidityChartData = [];
        state.lpChartCurrentValueChange = new BigNumber(0);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(midgardActions.getPools.pending, state => {
        state.poolLoading = true;
      })
      .addCase(midgardActions.getPools.fulfilled, (state, action) => {
        const pools = action.payload;
        const oldPools = state.pools as PoolMarketCap[];

        state.pools = pools.reduce((res: PoolMarketCap[], poolDetail) => {
          const pool = Pool.fromPoolData(poolDetail);
          if (pool) {
            const marketCap = Pool.extractPoolMarketCap(
              poolDetail.asset,
              oldPools,
            );
            res.push({marketCap, pool});
            const assetFound = state.assets.find(asset => {
              return (
                asset.ticker.toUpperCase() ===
                  pool.asset.ticker.toUpperCase() &&
                asset.chain === pool.asset.chain
              );
            });

            if (!assetFound) {
              state.assets.push(pool.asset);
            }
          }
          return res;
        }, []);
        state.poolLoading = false;
      })
      .addCase(midgardActions.getPools.rejected, state => {
        state.poolLoading = false;
      })
      .addCase(getAssetCurrentPriceData.fulfilled, (state, {payload}) => {
        const updatedPools = state.pools.map(data => {
          const {asset} = data.pool;
          const chain = asset.chain === Chain.Terra ? 'LUNA' : asset.chain;
          let ticker: string;
          if (asset.ticker === 'UST') {
            // hack because CMC lists UST as it's own chain
            ticker = `${asset.ticker}.${asset.ticker}`;
          } else if (asset.chain === 'ETH' && asset.ticker !== 'ETH') {
            ticker = `${chain}.${asset.symbol.split('-')[0]}-${asset.symbol
              .split('-')[1]
              .toUpperCase()}`;
          } else {
            ticker = `${chain}.${asset.ticker}`;
          }

          const assetObj = payload[ticker];

          if (assetObj) {
            return {
              marketCap: assetObj.market_cap,
              pool: data.pool,
            };
          }

          return data;
        });

        state.pools = updatedPools;
      })
      .addCase(midgardActions.getMemberDetail.pending, state => {
        state.memberDetailsLoading = true;
      })
      .addCase(midgardActions.getMemberDetail.fulfilled, (state, {payload}) => {
        payload.pools.forEach(payloadPool => {
          const foundIndex = state.memberDetails.pools.findIndex(
            memberPool => payloadPool.pool === memberPool.pool,
          );

          if (foundIndex !== -1) {
            // Note: We need to grab the latest data, since multiple addresses can contain the same pool,
            // and some of them are out to date. Therefore we need to compare the 'dateLastAdded' property
            // and update the member detail information only if the information is the latest one
            if (
              +payloadPool.dateLastAdded >
              +state.memberDetails.pools[foundIndex].dateLastAdded
            ) {
              state.memberDetails.pools[foundIndex] = payloadPool;
            }
          } else state.memberDetails.pools.push(payloadPool);
        });

        state.memberDetailsLoading = false;
      })
      .addCase(midgardActions.getMemberDetail.rejected, state => {
        state.memberDetailsLoading = false;
      })
      .addCase(midgardActions.updateLPLiquidity.fulfilled, (state, action) => {
        const foundIndex = state.memberDetailsLiquidityStats.findIndex(
          mdls => mdls.pool === action.payload.pool,
        );

        if (foundIndex !== -1) {
          state.memberDetailsLiquidityStats[foundIndex] = action.payload;
        } else {
          state.memberDetailsLiquidityStats.push(action.payload);
        }
      })
      .addCase(midgardActions.calculateLPChart.pending, state => {
        state.isLpChartLoading = true;
      })
      .addCase(midgardActions.calculateLPChart.fulfilled, (state, action) => {
        const chartData = Object.keys(action.payload).map(key => {
          return {
            date: fromUnixTime(action.payload[key].startIntervalTimestamp),
            value: action.payload[key].valueUsd,
          } as LpChartData;
        });

        state.liquidityChartData = chartData;
        state.isLpChartLoading = false;
      })
      .addCase(midgardActions.calculateLPChart.rejected, state => {
        state.isLpChartLoading = false;
      })
      .addCase(
        midgardActions.calculate24CurrentValueChange.fulfilled,
        (state, action) => {
          const response = Object.keys(action.payload)
            .map(key => action.payload[key])
            .reduce((prev, current) => {
              prev.value = prev.value
                .multipliedBy(100)
                .dividedBy(current.value)
                .minus(100)
                .multipliedBy(1e8);
              return prev;
            });

          state.lpChartCurrentValueChange = response.value;
        },
      )
      // used for getting all pool share data
      .addCase(
        midgardActions.getPoolMemberDetailByChain.pending,
        (state, action) => {
          const {
            arg: {chain},
          } = action.meta;

          state.chainMemberDetailsLoading = {
            ...state.chainMemberDetailsLoading,
            [chain]: true,
          };
        },
      )
      /**
       * NOTE: need to fetch pool member data for both chain address and thorchain address
       * get sym, assetAsym share from the MemberPool Data with non-thorchain address
       * get runeAsym share from the MemberPool Data with thorchain address
       */
      .addCase(
        midgardActions.getPoolMemberDetailByChain.fulfilled,
        (state, action) => {
          const {
            arg: {chain},
          } = action.meta;

          const {pools: memPools} = action.payload;

          const fetchedChainMemberDetails = getChainMemberDetails({
            chain,
            memPools,
            chainMemberDetails: state.chainMemberDetails,
          });

          state.chainMemberDetails = fetchedChainMemberDetails;

          state.chainMemberDetailsLoading = {
            ...state.chainMemberDetailsLoading,
            [chain]: false,
          };
        },
      )
      .addCase(
        midgardActions.getPoolMemberDetailByChain.rejected,
        (state, action) => {
          const {
            arg: {chain},
          } = action.meta;

          state.chainMemberDetailsLoading = {
            ...state.chainMemberDetailsLoading,
            [chain]: false,
          };
        },
      )
      // used for getting pool share for a specific chain
      .addCase(
        midgardActions.reloadPoolMemberDetailByChain.pending,
        (state, action) => {
          const {
            arg: {chain},
          } = action.meta;

          state.chainMemberDetailsLoading = {
            ...state.chainMemberDetailsLoading,
            [chain]: true,
          };
        },
      )
      /**
       * NOTE: need to fetch pool member data for both chain address and thorchain address
       * get sym, assetAsym share from the MemberPool Data with non-thorchain address
       * get runeAsym share from the MemberPool Data with thorchain address
       */
      .addCase(
        midgardActions.reloadPoolMemberDetailByChain.fulfilled,
        (state, action) => {
          const {
            arg: {chain},
          } = action.meta;

          const {runeMemberData, assetMemberData} = action.payload;

          const {pools: runeMemberDetails} = runeMemberData;
          const {pools: assetMemberDetails} = assetMemberData;

          // add rune asymm
          const fetchedChainMemberDetails1 = getChainMemberDetails({
            chain: THORChain,
            memPools: runeMemberDetails,
            chainMemberDetails: state.chainMemberDetails,
          });

          // add sym, asset asymm
          const fetchedChainMemberDetails2 = getChainMemberDetails({
            chain,
            memPools: assetMemberDetails,
            chainMemberDetails: fetchedChainMemberDetails1,
          });

          state.chainMemberDetails = fetchedChainMemberDetails2;

          state.chainMemberDetailsLoading = {
            ...state.chainMemberDetailsLoading,
            [chain]: false,
          };
        },
      )
      .addCase(
        midgardActions.reloadPoolMemberDetailByChain.rejected,
        (state, action) => {
          const {
            arg: {chain},
          } = action.meta;

          state.chainMemberDetailsLoading = {
            ...state.chainMemberDetailsLoading,
            [chain]: false,
          };
        },
      )
      .addCase(midgardActions.getStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(midgardActions.getNetworkData.fulfilled, (state, action) => {
        state.networkData = action.payload;
      })
      .addCase(midgardActions.getLastblock.fulfilled, (state, action) => {
        state.lastBlock = action.payload;
      })
      .addCase(midgardActions.getConstants.fulfilled, (state, action) => {
        state.constants = action.payload;
      })
      .addCase(midgardActions.getQueue.fulfilled, (state, action) => {
        state.queue = action.payload;
      })
      // get pool stats
      .addCase(midgardActions.getPoolStats.pending, state => {
        state.poolStatsLoading = true;
      })
      .addCase(midgardActions.getPoolStats.fulfilled, (state, action) => {
        state.poolStatsLoading = false;
        state.poolStats = action.payload;
      })
      .addCase(midgardActions.getPoolStats.rejected, state => {
        state.poolStatsLoading = true;
      })
      // get depth history
      .addCase(midgardActions.getDepthHistory.pending, state => {
        state.depthHistoryLoading = true;
      })
      .addCase(midgardActions.getDepthHistory.fulfilled, (state, action) => {
        state.depthHistoryLoading = false;
        state.depthHistory = action.payload;
      })
      .addCase(midgardActions.getDepthHistory.rejected, state => {
        state.depthHistoryLoading = true;
      })
      // get earnings history
      .addCase(midgardActions.getEarningsHistory.pending, state => {
        state.earningsHistoryLoading = true;
      })
      .addCase(midgardActions.getEarningsHistory.fulfilled, (state, action) => {
        state.earningsHistoryLoading = false;
        state.earningsHistory = action.payload;
      })
      .addCase(midgardActions.getEarningsHistory.rejected, state => {
        state.earningsHistoryLoading = true;
      })
      // get tvl history
      .addCase(midgardActions.getTVLHistory.pending, state => {
        state.tvlHistoryLoading = true;
      })
      .addCase(midgardActions.getTVLHistory.fulfilled, (state, action) => {
        state.tvlHistoryLoading = false;
        state.tvlHistory = action.payload;
      })
      .addCase(midgardActions.getTVLHistory.rejected, state => {
        state.tvlHistoryLoading = true;
      })
      // get swap history
      .addCase(midgardActions.getSwapHistory.pending, state => {
        state.swapHistoryLoading = true;
      })
      .addCase(midgardActions.getSwapHistory.fulfilled, (state, action) => {
        state.swapHistoryLoading = false;
        if (action.meta.arg.pool) {
          state.swapHistory = action.payload;
        } else {
          //@ts-ignore
          state.swapGlobalHistory = actions.payload;
        }
      })
      .addCase(midgardActions.getSwapHistory.rejected, state => {
        state.swapHistoryLoading = true;
      })
      // get liquidity history
      .addCase(midgardActions.getLiquidityHistory.pending, state => {
        state.liquidityHistoryLoading = true;
      })
      .addCase(
        midgardActions.getLiquidityHistory.fulfilled,
        (state, action) => {
          state.liquidityHistoryLoading = false;
          if (action.meta.arg.pool) {
            state.liquidityHistory = action.payload;
          } else {
          //@ts-ignore
            state.liquidityGlobalHistory = actions.payload;
          }
        },
      )
      .addCase(midgardActions.getLiquidityHistory.rejected, state => {
        state.liquidityHistoryLoading = true;
      })
      // get tx
      .addCase(midgardActions.getActions.pending, state => {
        state.txDataLoading = true;
      })
      .addCase(midgardActions.getActions.fulfilled, (state, action) => {
        state.txDataLoading = false;
        state.txData = action.payload;
      })
      .addCase(midgardActions.getActions.rejected, state => {
        state.txDataLoading = true;
      })
      // get thorchain mimir
      .addCase(midgardActions.getMimir.pending, state => {
        state.mimirLoading = true;
      })
      .addCase(midgardActions.getMimir.fulfilled, (state, action) => {
        state.mimirLoading = false;
        state.mimir = action.payload;
      })
      .addCase(midgardActions.getMimir.rejected, state => {
        state.mimirLoading = true;
      })
      // poll Tx
      .addCase(midgardActions.pollTx.fulfilled, (state, action) => {
        const {arg: txTracker} = action.meta;
        const txData = action.payload?.actions?.[0];

        if (txData) {
          state.txTrackers = state.txTrackers.map((tracker: TxTracker) => {
            if (tracker.uuid === txTracker.uuid) {
              const status =
                txData.status === ActionStatusEnum.Pending
                  ? TxTrackerStatus.Pending
                  : TxTrackerStatus.Success;

              const refunded =
                status === TxTrackerStatus.Success &&
                txData.type === ActionTypeEnum.Refund;

              return {
                ...tracker,
                action: txData,
                status,
                refunded,
              };
            }

            return tracker;
          });
        }
      })
      // poll Upgrade Tx
      .addCase(midgardActions.pollUpgradeTx.fulfilled, (state, action) => {
        const {arg: txTracker} = action.meta;
        const {actions} = action.payload;
        const txData = actions?.[0];
        const {
          submitTx: {submitDate},
        } = txTracker;

        if (submitDate && txData) {
          const {date} = txData;

          if (
            moment.unix(Number(date) / 1000000000).isAfter(moment(submitDate))
          ) {
            state.txTrackers = state.txTrackers.map((tracker: TxTracker) => {
              if (tracker.uuid === txTracker.uuid) {
                const status =
                  txData.status === ActionStatusEnum.Pending
                    ? TxTrackerStatus.Pending
                    : TxTrackerStatus.Success;

                const refunded =
                  status === TxTrackerStatus.Success &&
                  txData.type === ActionTypeEnum.Refund;

                return {
                  ...tracker,
                  action: txData,
                  status,
                  refunded,
                };
              }

              return tracker;
            });
          }
        }
      })
      // poll Approve Tx
      .addCase(midgardActions.pollApprove.fulfilled, (state, action) => {
        const {asset, approved} = action.payload;
        const {arg: txTracker} = action.meta;

        if (asset) {
          state.txTrackers = state.txTrackers.map((tracker: TxTracker) => {
            if (tracker.uuid === txTracker.uuid) {
              const status = approved
                ? TxTrackerStatus.Success
                : TxTrackerStatus.Pending;

              // save approve status to state
              state.approveStatus = {
                ...state.approveStatus,
                [asset.toString()]: status,
              };

              return {
                ...tracker,
                status,
              };
            }

            return tracker;
          });
        }
      })
      // get 24h volume
      .addCase(midgardActions.getVolume24h.fulfilled, (state, action) => {
        state.volume24h = action.payload;
      })
      // get thornode inbound addresses
      .addCase(
        midgardActions.getThorchainInboundData.fulfilled,
        (state, action) => {
          state.inboundData = action.payload;
        },
      )
      // get pending LP
      .addCase(midgardActions.getLiquidityProviderData.pending, state => {
        state.pendingLPLoading = true;
      })
      .addCase(
        midgardActions.getLiquidityProviderData.fulfilled,
        (state, action) => {
          const {
            arg: {asset},
          } = action.meta;
          const data = action.payload;

          if (isPendingLP(data)) {
            state.pendingLP = {
              [asset]: data,
              ...state.pendingLP,
            };
          } else {
            delete state.pendingLP?.[asset];
          }
          state.pendingLPLoading = false;
        },
      )
      .addCase(midgardActions.getLiquidityProviderData.rejected, state => {
        state.pendingLPLoading = false;
      })
      .addCase(midgardActions.getTopPositions.fulfilled, (state, {payload}) => {
        state.lpPositions = payload;
      })
      .addCase(midgardActions.approveAssetPoll.pending, (state, {meta}) => {
        state.assetApprovals.push({
          asset: meta.arg.ticker,
          inProgress: true,
          isApproved: false,
        });
      })
      .addCase(midgardActions.approveAssetPoll.rejected, (state, {payload}) => {
        if (!payload) return;

        const index = state.assetApprovals.findIndex(a => a.asset === payload);

        if (index !== -1) {
          state.assetApprovals[index].inProgress = false;
          state.assetApprovals[index].isApproved = false;
        }
      })
      .addCase(
        midgardActions.approveAssetPollResponse.fulfilled,
        (state, {payload}) => {
          const index = state.assetApprovals.findIndex(
            a => a.asset === payload.asset,
          );

          if (index !== -1) {
            state.assetApprovals[index].inProgress = false;
            state.assetApprovals[index].isApproved = payload.isApproved;
          }
        },
      )
      .addCase(walletActions.disconnect, state => {
        state.lpPositions = [];
        state.txData = {
          actions: [],
          count: '0',
        };
        state.txTrackers = [];
        state.liquidityChartData = [];
        state.memberDetails.pools = [];
        state.memberDetailsLiquidityStats = [];
        state.memberDetailsPositionStats = [];
        state.lpChartCurrentValueChange = new BigNumber(0);
        state.newTxTrackers = [];
        state.txCollapsed = true;
        state.isLpChartLoading = false;
      });
  },
});

export const {reducer, actions} = slice;
export const selectState = (state: RootState) => state.midgard;

export const selectPoolsMarketCap = createSelector(
  (state: RootState) => state.midgard.pools,
  pools => {
    const sorted = [...pools];
    return sorted.sort((a, b) => (a.marketCap < b.marketCap ? 1 : -1));
  },
);

export const selectAvailablePoolsMarketCap = createSelector(
  (state: RootState) => state.midgard.pools,
  pools => {
    const sorted = [...pools];
    return sorted
      .filter(pmc => pmc.pool.detail.status === 'available')
      .sort((a, b) => (a.marketCap < b.marketCap ? 1 : -1));
  },
);

export const selectPools = createSelector(selectPoolsMarketCap, pools =>
  pools.map(data => data.pool),
);

export const selectAvailablePools = createSelector(
  selectAvailablePoolsMarketCap,
  pools => pools.map(data => data.pool),
);

export const selectAvailablePoolAssets = createSelector(
  selectAvailablePools,
  pools => {
    const assets = pools.map(pool => pool.asset);
    assets.push(Asset.RUNE());
    return assets;
  },
);

export const selectFilteredPoolAssets = createSelector(
  selectAvailablePoolAssets,
  (_, searchString: string) => searchString,
  (assets, searchString) => {
    if (!searchString) {
      return assets;
    }

    return assets.filter(
      asset =>
        asset?.name?.toLowerCase()?.includes(searchString.toLowerCase()) ||
        asset?.ticker?.toLowerCase()?.includes(searchString.toLowerCase()),
    );
  },
);

export const selectAvailableThorchainAssetAmounts = createSelector(
  (state: RootState) => state.wallet.wallet,
  selectAvailablePoolAssets,
  (wallet, assets: Asset[]) => {
    if (!wallet) {
      return [];
    }

    return SUPPORTED_CHAINS.map(chain => wallet[chain]?.balance)
      .flat()
      .filter(assetAmount => assetAmount && assetAmount.amount.gt(0))
      .filter(assetAmount =>
        assets.some(asset => asset.symbol === assetAmount?.asset.symbol),
      );
  },
);

export const selectTxActions = createSelector(
  (state: RootState) => state.midgard.txData,
  txData => txData.actions,
);

export const selectSortedTxActions = createSelector(
  selectTxActions,
  txActions => {
    const sort = [...txActions];
    return sort.sort((a, b) => (+a.date < +b.date ? 1 : -1));
  },
);

const filterAddressAndTx = (
  transactions: Transaction[],
  searchString: string,
) => {
  const txs = transactions?.filter(
    tx =>
      tx.address?.toLowerCase()?.includes(searchString.toLowerCase()) ||
      tx.txID?.toLowerCase()?.includes(searchString.toLowerCase()),
  );

  return txs.length > 0;
};

export const selectFilteredTxActions = createSelector(
  selectSortedTxActions,
  (_, searchString: string, type: string, offset: number, limit = 10) => ({
    searchString,
    type,
    offset,
    limit,
  }),
  (txActions: Action[], {searchString, type, offset, limit}) => {
    let filtered = txActions;
    let count = 0;
    const searchValue = searchString.trim();

    if (type && type !== 'all') {
      filtered = filtered.filter(txAction =>
        txAction?.type?.toLowerCase()?.includes(type.toLowerCase()),
      );
    }

    if (searchValue) {
      filtered = filtered.filter(
        txAction =>
          filterAddressAndTx(txAction.in, searchValue) ||
          filterAddressAndTx(txAction.out, searchValue),
      );
    }

    count = filtered.length;
    filtered = filtered.slice(offset).slice(0, limit);

    return {actions: filtered, count};
  },
);

type ActionGroup = {
  date: string;
  actions: Action[];
};

export const selectActionGroups = createSelector(
  selectSortedTxActions,
  (txActions: Action[]) => {
    // Format dates from actions array, eliminate minutes and seconds. i.e. 20221027
    const formatted = txActions.map(action => {
      return {
        ...action,
        date: getFormatted(action.date),
      } as Action;
    });

    // Group by date, insert all coincidences
    const actionGroups = [...new Set(formatted.map(a => a.date))].map(date => {
      return {
        date,
        actions: txActions.filter(action => getFormatted(action.date) === date),
      } as ActionGroup;
    });

    return actionGroups;
  },
);

export const selectFilteredActionGroups = createSelector(
  selectActionGroups,
  (_, searchString: string, chain: string, offset: number, limit = 10) => ({
    searchString,
    chain,
    offset,
    limit,
  }),
  (actionGroups: ActionGroup[], {searchString, chain, offset, limit}) => {
    let filtered = actionGroups;
    const searchValue = searchString.trim();

    if (chain && chain !== 'all') {
      filtered = filtered.map(ag => {
        return {
          date: ag.date,
          actions: ag.actions.filter(action =>
            action.pools.some(p =>
              p.toLowerCase().includes(chain.toLowerCase()),
            ),
          ),
        };
      });

      // Grab only the groups that contain coincidences with search value
      filtered = filtered.filter(ag => ag.actions.length > 0);
    }

    if (searchValue) {
      filtered = filtered.map(ag => {
        return {
          date: ag.date,
          actions: ag.actions.filter(
            action =>
              filterAddressAndTx(action.in, searchValue) ||
              filterAddressAndTx(action.out, searchValue),
          ),
        };
      });

      // Grab only the groups that contain coincidences with search value
      filtered = filtered.filter(ag => ag.actions.length > 0);
    }

    const count = filtered.length;

    // Paginate result
    filtered = filtered.slice(offset).slice(0, limit);

    return {actionGroups: filtered, count};
  },
);

export const selectPoolByAssetName = createSelector(
  selectPools,
  (_, assetName: string) => assetName,
  (pools: Pool[], assetName) => pools.find(p => p.detail.asset === assetName),
);

export const selectMemberPools = createSelector(
  (state: RootState) => state.midgard.memberDetails,
  memberDetails => memberDetails.pools,
);

export const selectMemberPoolsByAssetName = createSelector(
  selectMemberPools,
  (_, assetName: string) => assetName,
  (memberDetails: MemberPool[], assetName) => {
    if (assetName === 'all') {
      return memberDetails;
    }

    return memberDetails.filter(p => p.pool === assetName);
  },
);

export const selectLiquidityStatsByAssetName = (
  state: RootState,
  assetName: string,
) =>
  state.midgard.memberDetailsLiquidityStats.find(
    member => member.pool === assetName,
  );

export const selectMemberDetailsPositionStats = (state: RootState) => {
  return state.midgard.memberDetailsPositionStats
    .map(
      position =>
        ({
          totalCurrentValue: position.currentValue,
          totalAddedValue: position.addedValue,
          totalWithdrawnValue: position.withdrawnValue,
          totalGainLoss: position.gainLossUSD,
        } as PortfolioOverview),
    )
    .reduce(
      (previous, current) => {
        return {
          totalCurrentValue: previous.totalCurrentValue.plus(
            current.totalCurrentValue,
          ),
          totalAddedValue: previous.totalAddedValue.plus(
            current.totalAddedValue,
          ),
          totalWithdrawnValue: previous.totalWithdrawnValue.plus(
            current.totalWithdrawnValue,
          ),
          totalGainLoss: previous.totalGainLoss.plus(current.totalGainLoss),
        };
      },
      {
        totalCurrentValue: new BigNumber(0),
        totalAddedValue: new BigNumber(0),
        totalWithdrawnValue: new BigNumber(0),
        totalGainLoss: new BigNumber(0),
      },
    );
};

export const selectLpChartDataByCategory = (state: RootState): LpChartData[] =>
  state.midgard.liquidityChartData;

export const selectLpChartCurrentValueChange = (state: RootState): BigNumber =>
  state.midgard.lpChartCurrentValueChange;

export const selectApprovalAsset = (
  state: RootState,
  asset: string,
): AssetApproval | undefined =>
  state.midgard.assetApprovals.find(ap => ap.asset === asset);

export const selectTopPositions = (state: RootState, limit = 5) => {
  const positons = [...state.midgard.lpPositions];
  return positons
    .sort((a, b) => (a.currentValue > b.currentValue ? -1 : 1))
    .slice(0, limit);
};

export default slice;
