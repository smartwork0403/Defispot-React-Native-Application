import {createAsyncThunk} from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import {
  addSeconds,
  getMinutes,
  getDaysInMonth,
  getUnixTime,
  subDays,
  subHours,
  setMinutes,
  subMinutes,
  subYears,
} from 'date-fns';
import {
  Action,
  ActionsList,
  ActionListParams,
  ActionTypeEnum,
  DepthHistory,
  ActionStatusEnum,
  MemberPool,
} from '../../SDKs/midgard-sdk';
import {Asset} from '../../SDKs/multichain-sdk';
import {v4 as uuidv4} from 'uuid';

import {midgardApi} from '../../services/midgard';
import {multichain} from '../../services/multichain';
import {
  getThorchainMimir,
  getInboundData,
  getLiquidityProvider,
} from '../../services/thornode';

import {bigNumberToAbbreviate, bigNumberToFixed} from '../../helpers/AssetUtil';

import {config} from '../../settings/config';

import {SupportedChain} from '../../SDKs/multichain-sdk/clients/types';
import type {RootState} from '../store';
import {
  AssetApproval,
  Interval,
  IntervalData,
  IntervalValue,
  LiquidityParams,
  LpChartIntervals,
  LpPosition,
  MemberDetailsLiquidityStats,
  MemberPoolData,
  TxTracker,
} from './types';

export const getPools = createAsyncThunk(
  'midgard/getPools',
  midgardApi.getPools,
);

export const getPoolStats = createAsyncThunk(
  'midgard/getPoolStats',
  midgardApi.getPoolStats,
);

export const getNetworkData = createAsyncThunk(
  'midgard/getNetworkData',
  midgardApi.getNetworkData,
);

export const getLastblock = createAsyncThunk(
  'midgard/getLastblock',
  midgardApi.getLastblock,
);

export const getStats = createAsyncThunk(
  'midgard/getStats',
  midgardApi.getStats,
);

export const getConstants = createAsyncThunk(
  'midgard/getConstants',
  midgardApi.getConstants,
);

export const getQueue = createAsyncThunk(
  'midgard/getQueue',
  midgardApi.getQueue,
);

type TxAction = {
  id: string;
  action: Action;
};

// TODO: !IMPORTANT. This is a temporal workaround. This is an anti-pattern and should be refactored once the back end
// api is implemented. We should NOT perform multiple requests to pull all the tx actions by wallet. The correct implementantion
// will require a back end api with pagination and filtering support.
export const getActions = createAsyncThunk<ActionsList, ActionListParams>(
  'midgard/getActions',
  async (params: ActionListParams, {dispatch}) => {
    const {actions} = await getActionsAsync(params);

    const results = distinctActions(actions);

    dispatch(fetchAllMemberDetails(params.address || ''));

    return {
      actions: results,
      count: results.length.toString(),
    } as ActionsList;
  },
);

const distinctActions = (actions: Action[]): Action[] => {
  const txActions: TxAction[] = actions.map(tx => ({
    id: uuidv4(),
    action: tx,
  }));

  const result: TxAction[] = [];
  const duplicates: string[] = [];

  // Remove system fee transactions related to main transactions (Workaround)
  txActions.forEach(tx => {
    const {action} = tx;

    const isDuplicate = duplicates.includes(tx.id);
    const exist = result.find(r => r.id === tx.id);

    if (isDuplicate || exist) {
      return;
    }

    const duplicateIn = txActions.filter(txAction =>
      txAction.action.in.some(
        inTx => inTx.txID && inTx.txID === action.in[0]?.txID,
      ),
    );

    const duplicateOut = txActions.filter(txAction =>
      txAction.action.out.some(
        outTx => outTx.txID && outTx.txID === action.out[0]?.txID,
      ),
    );

    if (duplicateIn.length > 1) {
      const first = duplicateIn[0].action.in[0];
      const second = duplicateIn[1].action.in[0];

      if (+first.coins[0].amount > +second.coins[0].amount) {
        result.push(duplicateIn[0]);
        duplicates.push(duplicateIn[1].id);
      } else {
        result.push(duplicateIn[1]);
        duplicates.push(duplicateIn[0].id);
      }
    } else if (duplicateOut.length > 1) {
      const first = duplicateOut[0].action.out[0];
      const second = duplicateOut[1].action.out[0];

      if (+first.coins[0].amount > +second.coins[0].amount) {
        result.push(duplicateOut[0]);
        duplicates.push(duplicateOut[1].id);
      } else {
        result.push(duplicateOut[1]);
        duplicates.push(duplicateOut[0].id);
      }
    } else {
      result.push(tx);
    }
  });
  return result.map(t => t.action);
};

const getActionsAsync = async (params: ActionListParams) => {
  let txActions: Action[] = [];
  let txCount = '0';

  const {actions, count} = await midgardApi.getActions(params);

  if (count && actions.length > 0) {
    const validActions = actions.filter(
      a => a.status === ActionStatusEnum.Success,
    );

    txActions = [...validActions];
    txCount = validActions.length.toString();

    if (txActions.length < +count) {
      const offset = params.offset + params.limit;

      const {actions: tx} = await getActionsAsync({...params, offset});
      txActions = [...txActions, ...tx];
    }
  }

  return {actions: txActions, count: txCount};
};

export const fetchHistoricalActionPrice = createAsyncThunk(
  'midgard/fetchHistoricalActionPrice',
  async ({pool, liquidityUnits}: MemberPoolData, {dispatch, getState}) => {
    const state = getState() as RootState;
    const {txData} = state.midgard;

    const historyPromises: Promise<DepthHistory>[] = [];

    const liquidityActions = getLiquidityActionsFromActionsList(
      txData,
      pool.detail.asset,
    );

    liquidityActions.forEach(a => {
      if (!a.pools.find(p => p === pool.detail.asset)) {
        return;
      }

      const dNano = a.date;
      const dSec = Math.floor(+dNano / 1e9);

      historyPromises.push(
        midgardApi.getDepthHistory({
          pool: pool.detail.asset,
          query: {to: dSec, from: dSec},
        }),
      );
    });

    Promise.all(historyPromises)
      .then(async responses => {
        try {
          return await Promise.all(responses.map(res => res));
        } catch (err) {
          throw new Error(`HTTP error! error: ${err}`);
        }
      })
      .then(historyData => {
        const assetPriceInRuneByTime = {
          assetName: pool.detail.asset,
        };
        historyData.forEach(item => {
          assetPriceInRuneByTime[item.meta.startTime] = {
            assetPriceUSD: item.intervals[0].assetPriceUSD,
            assetPrice: item.intervals[0].assetPrice,
          };
        });

        dispatch(
          updateLPLiquidity({
            pool,
            runePriceHistory: assetPriceInRuneByTime,
            liquidityUnits,
          }),
        );
      });
  },
);

const calculateTimeInterval = (interval: Interval) => {
  const result = {} as IntervalData;
  let endDate = 0;

  if (interval === Interval.hour) {
    const incrementBy = 5;
    endDate = new Date().setSeconds(0);

    const currentMinutes = getMinutes(endDate);
    const roundedMinutes =
      Math.ceil(currentMinutes / incrementBy) * incrementBy;
    const updatedEndDate = setMinutes(endDate, roundedMinutes);

    result.startDate = subMinutes(updatedEndDate, 60);
    result.increment = 60 * incrementBy;
  }

  if (interval === Interval.day) {
    endDate = new Date().setMinutes(0, 0);
    result.startDate = subHours(endDate, 24);
    result.increment = 60 * 60;
  }

  if (interval === Interval.month) {
    endDate = new Date().setHours(0, 0, 0);
    result.startDate = subDays(endDate, 30);
    result.increment = 24 * 60 * 60;
  }

  if (interval === Interval.year) {
    endDate = new Date().setHours(0, 0, 0);
    result.startDate = subYears(endDate, 1);
    result.increment = 30 * 24 * 60 * 60;
  }

  result.endTimestamp = getUnixTime(endDate);
  result.startTimestamp = getUnixTime(result.startDate);
  result.incrementLimit = result.increment - 1;

  return result;
};

/**
 * Creates a set of intervals regarding the the input value
 * @param intervalData Contains the interval information regarding the periodicity, it can be hourly, daily, monthly or yearly
 * @param asset Asset name
 * @returns LpChartHistory intervals dictionary with DepthHistory data
 */
const createIntervals = async (
  interval: Interval,
  intervalData: IntervalData,
  asset: string,
) => {
  const intervals = {} as LpChartIntervals;

  const {endTimestamp, increment, incrementLimit} = intervalData;
  let {startDate, startTimestamp} = intervalData;

  const historyPromises: Promise<DepthHistory>[] = [];
  while (startTimestamp <= endTimestamp) {
    const endIntervalDate = addSeconds(startDate, incrementLimit);
    const endIntervalTimestamp = getUnixTime(endIntervalDate);

    intervals[startTimestamp] = {
      startIntervalTimestamp: startTimestamp,
      endIntervalTimestamp,
      value: new BigNumber(0),
      valueUsd: '',
      liquidityUnits: new BigNumber(0),
      runeDepth: new BigNumber(0),
      assetDepth: new BigNumber(0),
      assetPrice: new BigNumber(0),
      assetPriceUsd: new BigNumber(0),
    };

    historyPromises.push(
      midgardApi.getDepthHistory({
        pool: asset,
        query: {to: endIntervalTimestamp, from: startTimestamp},
      }),
    );

    // For yearly case, the increment will be calculated based on the number of days the month has
    if (interval === Interval.year) {
      const numOfDays = getDaysInMonth(startDate);
      startDate = addSeconds(startDate, numOfDays * 24 * 60 * 60);
    } else {
      startDate = addSeconds(startDate, increment);
    }

    startTimestamp = getUnixTime(startDate);
  }

  try {
    const historyData = await Promise.all(historyPromises);

    historyData.forEach(item => {
      intervals[item.meta.startTime] = {
        ...intervals[item.meta.startTime],
        liquidityUnits: new BigNumber(item.intervals[0].liquidityUnits),
        assetDepth: new BigNumber(item.intervals[0].assetDepth),
        runeDepth: new BigNumber(item.intervals[0].runeDepth),
        assetPrice: new BigNumber(item.intervals[0].assetPrice),
        assetPriceUsd: new BigNumber(item.intervals[0].assetPriceUSD),
      };
    });

    return intervals;
  } catch (err) {
    throw new Error(`HTTP error! error: ${err}`);
  }
};

/**
 * Calculates the member liquidity previous the specified timestamp
 * @param timestamp Specify the timestamp where the previous liquidity will be calculated from
 * @param actions List of actions where the previous liquidity will be calculate from
 * @returns Member liquidity total represented as BigNumber
 */
const calculateAccumulatedLiquidity = (
  timestamp: number,
  actions: Action[],
) => {
  const previousActions = actions.filter(action => {
    const actionTimestamp = Math.floor(+action.date / 1e9);
    return actionTimestamp < timestamp;
  });

  let addedLiquidity = new BigNumber(0);
  let withdrawnLiquidity = new BigNumber(0);

  if (previousActions && previousActions.length > 0) {
    addedLiquidity = previousActions
      .map(action => {
        if (!action.metadata.addLiquidity) {
          return new BigNumber(0);
        }
        return new BigNumber(action.metadata.addLiquidity.liquidityUnits);
      })
      .reduce((prev, current) => prev.plus(current));

    withdrawnLiquidity = previousActions
      .map(action => {
        if (!action.metadata.withdraw) {
          return new BigNumber(0);
        }
        return new BigNumber(action.metadata.withdraw.liquidityUnits);
      })
      .reduce((prev, current) => prev.plus(current));
  }

  return addedLiquidity.minus(withdrawnLiquidity);
};

const getLiquidityActionsFromActionsList = (
  txData: ActionsList | null,
  asset: string,
) => {
  if (txData === null) {
    return [];
  }

  return txData.actions.filter(
    action =>
      (action.type === ActionTypeEnum.AddLiquidity ||
        action.type === ActionTypeEnum.Withdraw) &&
      action.status === ActionStatusEnum.Success &&
      action.pools.length === 1 &&
      action.pools[0] === asset,
  );
};

const calculateCurrentValueByInterval = (
  intervals: LpChartIntervals,
  intervalData: IntervalData,
  actions: Action[],
): IntervalValue[] => {
  const intervalValues: IntervalValue[] = [];
  let currentLiquidity = new BigNumber(0);
  let accumulatedLiquidity = calculateAccumulatedLiquidity(
    intervalData.startTimestamp,
    actions,
  );

  // We'll iterate thorugh each interval, and find those actions between each interval, then +/- the added/withdraw
  // liquidity and add it to the accumulated total, so next intervals take into account previous liquidity transactions
  Object.keys(intervals).forEach(key => {
    const interval = intervals[key];

    const actionsInInterval = actions.filter(action => {
      const actionTimestamp = Math.floor(+action.date / 1e9);

      return (
        actionTimestamp >= interval.startIntervalTimestamp &&
        actionTimestamp <= interval.endIntervalTimestamp
      );
    });

    if (actionsInInterval && actionsInInterval.length > 0) {
      currentLiquidity = actionsInInterval
        .map(action => {
          const added = action.metadata.addLiquidity
            ? new BigNumber(action.metadata.addLiquidity.liquidityUnits)
            : new BigNumber(0);

          const withdrawn = action.metadata.withdraw
            ? new BigNumber(action.metadata.withdraw.liquidityUnits)
            : new BigNumber(0);

          return added.minus(withdrawn);
        })
        .reduce((prev, current) => prev.plus(current));

      accumulatedLiquidity = accumulatedLiquidity.plus(currentLiquidity);
    }

    let accountShare = new BigNumber(0);

    if (accumulatedLiquidity.isGreaterThan(0)) {
      accountShare = accumulatedLiquidity.dividedBy(interval.liquidityUnits);
    }

    const runePriceUsd = interval.assetPriceUsd.dividedBy(interval.assetPrice);
    const redeemableAsset = accountShare.multipliedBy(interval.assetDepth);
    const redeemableRune = accountShare.multipliedBy(interval.runeDepth);
    const totalInAsset = redeemableAsset.multipliedBy(interval.assetPriceUsd);
    const totalInRune = redeemableRune.multipliedBy(runePriceUsd);
    const currentValue = totalInAsset.plus(totalInRune);

    intervalValues.push({
      key,
      value: currentValue,
      valueUsd: bigNumberToFixed(currentValue, 2),
    });
  });

  return intervalValues;
};

/**
 * Calculates the liquidity by Asset
 * @param asset Asset name. Example: BTC.BTC
 * @param interval Interval value. Example 1h
 * @param intervalData Interval data
 * @param txData Actions List
 * @returns A set of intervals with its liquidity calculated
 */
const calculateAssetLiquidity = async (
  asset: string,
  interval: Interval,
  intervalData: IntervalData,
  txData: ActionsList | null,
) => {
  const liquidityActions = getLiquidityActionsFromActionsList(txData, asset);
  const intervals = await createIntervals(interval, intervalData, asset);
  const intervalValues = calculateCurrentValueByInterval(
    intervals,
    intervalData,
    liquidityActions,
  );

  intervalValues.forEach(intervalValue => {
    const {key, value, valueUsd} = intervalValue;
    intervals[key].value = value;
    intervals[key].valueUsd = valueUsd;
  });
  return intervals;
};

const calculateChart = async (
  intervalData: IntervalData,
  pools: MemberPool[],
  actions: ActionsList | null,
  interval: Interval = Interval.day,
) => {
  const promises = pools.map(memberPool => {
    const asset = Asset.fromAssetString(memberPool.pool) || Asset.RUNE();
    return calculateAssetLiquidity(
      asset.toURLEncoded(),
      interval,
      intervalData,
      actions,
    );
  });

  const intervals = await Promise.all(promises);

  if (intervals.length === 1) {
    const int = intervals[0];
    Object.keys(intervals[0]).forEach(key => {
      int[key].valueUsd = bigNumberToFixed(int[key].value, 2);
    });
    return int;
  }
  const response = intervals.reduce((prev, current) => {
    Object.keys(prev).forEach(key => {
      prev[key].value = prev[key].value.plus(current[key].value);
      prev[key].valueUsd = bigNumberToFixed(prev[key].value, 2);
    });
    return prev;
  });

  return response;
};

type LpChartParams = {
  interval: Interval;
  pools: MemberPool[];
};

export const calculateLPChart = createAsyncThunk<
  LpChartIntervals,
  LpChartParams
>(
  'midgard/calculateLPChart',
  async ({interval, pools}: LpChartParams, {getState, dispatch}) => {
    const state = getState() as RootState;
    const {txData} = state.midgard;

    const intervalData = calculateTimeInterval(interval);
    const response = await calculateChart(
      intervalData,
      pools,
      txData,
      interval,
    );

    dispatch(calculate24CurrentValueChange(pools));

    return response;
  },
);

export const calculate24CurrentValueChange = createAsyncThunk<
  LpChartIntervals,
  MemberPool[]
>(
  'midgard/calculate24CurrentValueChange',
  async (pools: MemberPool[], {getState}) => {
    const state = getState() as RootState;
    const {txData} = state.midgard;

    const intervalData = {} as IntervalData;
    const endDate = new Date().setMinutes(0, 0);
    intervalData.startDate = subHours(endDate, 24);
    intervalData.increment = 24 * 60 * 60;
    intervalData.endTimestamp = getUnixTime(endDate);
    intervalData.startTimestamp = getUnixTime(intervalData.startDate);
    intervalData.incrementLimit = intervalData.increment - 1;
    const response = await calculateChart(intervalData, pools, txData);

    return response;
  },
);

export const updateLPLiquidity = createAsyncThunk<
  MemberDetailsLiquidityStats,
  LiquidityParams
>(
  'midgard/updateLPLiquidity',
  async (
    {pool, runePriceHistory, liquidityUnits}: LiquidityParams,
    {getState},
  ) => {
    const state = getState() as RootState;
    const {txData} = state.midgard;

    let addedRune = 0;
    let addedAsset = 0;
    let addedValueInUSD = 0;
    let withdrawnRune = 0;
    let withdrawnAsset = 0;
    let withdrawnValueInUSD = 0;

    const liquidityActions = getLiquidityActionsFromActionsList(
      txData,
      pool.detail.asset,
    );

    liquidityActions.forEach(action => {
      const s = Math.floor(+action.date / 1e9);
      const {assetPrice, assetPriceUSD} = runePriceHistory[s];
      const runePriceUSD = assetPriceUSD / assetPrice;

      const valueInUsd = (coin, assetFilter) => {
        switch (coin.asset) {
          case 'THOR.RUNE':
            return Number(coin.amount) * runePriceUSD;
          case assetFilter:
            return Number(coin.amount) * assetPriceUSD;
          default:
            return 0;
        }
      };

      let inRune = 0;
      let inAsset = 0;
      let inValueInUSD = 0;
      let outRune = 0;
      let outAsset = 0;
      let outValueInUSD = 0;
      action.in.forEach(inputs => {
        inputs.coins.forEach(coin => {
          inRune += coin.asset === 'THOR.RUNE' ? Number(coin.amount) : 0;
          inAsset += coin.asset === pool.detail.asset ? Number(coin.amount) : 0;
          inValueInUSD += valueInUsd(coin, pool.detail.asset);
        });
      });
      action.out.forEach(inputs => {
        inputs.coins.forEach(coin => {
          outRune += coin.asset === 'THOR.RUNE' ? Number(coin.amount) : 0;
          outAsset +=
            coin.asset === pool.detail.asset ? Number(coin.amount) : 0;
          outValueInUSD += valueInUsd(coin, pool.detail.asset);
        });
      });
      switch (action.type) {
        case ActionTypeEnum.Withdraw:
          // In rune/asset/value contain the amount in the withdraw
          // transaction, that is the one with the withdraw memo.
          withdrawnRune += outRune - inRune;
          withdrawnAsset += outAsset - inAsset;
          withdrawnValueInUSD += outValueInUSD - inValueInUSD;
          break;
        case ActionTypeEnum.AddLiquidity:
          // Out rune/asset/value should be 0 for addLiquidity events,
          // but we include them here just in case.
          addedRune += inRune - outRune;
          addedAsset += inAsset - outAsset;
          addedValueInUSD += inValueInUSD - outValueInUSD;
          break;
        default:
          break;
      }
    });

    const redeemableRune =
      (+liquidityUnits / +pool.detail.liquidityUnits) * +pool.detail.runeDepth;
    const redeemableAsset =
      (+liquidityUnits / +pool.detail.liquidityUnits) * +pool.detail.assetDepth;

    const realizedReturnValueInUSD = withdrawnValueInUSD - addedValueInUSD;

    return {
      pool: pool.detail.asset,
      addedRune,
      addedAsset,
      addedValueInUSD,
      withdrawnRune,
      withdrawnAsset,
      withdrawnValueInUSD,
      redeemableRune,
      redeemableAsset,
      realizedReturnValueInUSD,
    } as MemberDetailsLiquidityStats;
  },
);

export const getTopPositions = createAsyncThunk<LpPosition[], MemberPool[]>(
  'midgard/getTopPositions',
  async (memberPools, {getState}) => {
    const state = getState() as RootState;
    const {pools, stats} = state.midgard;

    const positions: LpPosition[] = [];
    memberPools.forEach(mp => {
      const pool = pools
        .map(memberPool => memberPool.pool)
        .find(p => p.detail.asset === mp.pool);

      if (!pool) {
        return;
      }

      if (!stats || !stats.runePriceUSD) {
        return new BigNumber(0);
      }
      if (!pool) {
        return new BigNumber(0);
      }

      const accountShare = new BigNumber(mp.liquidityUnits).dividedBy(
        pool.detail.liquidityUnits,
      );
      const redeemableRune = accountShare.multipliedBy(pool.detail.runeDepth);
      const redeemableAsset = accountShare.multipliedBy(pool.detail.assetDepth);
      const totalInAsset = redeemableAsset.multipliedBy(
        pool.detail.assetPriceUSD,
      );
      const totalInRune = redeemableRune.multipliedBy(stats.runePriceUSD);

      const currentValue = totalInAsset.plus(totalInRune);

      positions.push({
        currentValue: parseFloat(bigNumberToAbbreviate(currentValue, 2)),
        pool: mp.pool,
        symbol: pool.asset.symbol,
      });
    });

    return positions;
  },
);

export const fetchAllMemberDetails = createAsyncThunk(
  'midgard/fetchAllMemberDetails',
  async (addressString: string, {dispatch}) => {
    const addresses = addressString.split(',');
    addresses.forEach(address => dispatch(getMemberDetail(address)));
  },
);

export const getTVLHistory = createAsyncThunk(
  'midgard/getTVLHistory',
  midgardApi.getTVLHistory,
);

export const getSwapHistory = createAsyncThunk(
  'midgard/getSwapHistory',
  midgardApi.getSwapHistory,
);

export const getLiquidityHistory = createAsyncThunk(
  'midgard/getLiquidityHistory',
  midgardApi.getLiquidityHistory,
);

export const getEarningsHistory = createAsyncThunk(
  'midgard/getEarningsHistory',
  midgardApi.getEarningsHistory,
);

export const getDepthHistory = createAsyncThunk(
  'midgard/getDepthHistory',
  midgardApi.getDepthHistory,
);

export const getMemberDetail = createAsyncThunk(
  'midgard/getMemberDetail',
  midgardApi.getMemberDetail,
);

// NOTE: pass chain and address to param
export const getPoolMemberDetailByChain = createAsyncThunk(
  'midgard/getPoolMemberDetailByChain',
  async ({address}: {chain: SupportedChain; address: string}) => {
    const response = await midgardApi.getMemberDetail(address);

    return response;
  },
);

// NOTE: pass chain, thorchain address, chain wallet address for wallet
export const reloadPoolMemberDetailByChain = createAsyncThunk(
  'midgard/reloadPoolMemberDetailByChain',
  async ({
    thorchainAddress,
    assetChainAddress,
  }: {
    chain: SupportedChain;
    thorchainAddress: string;
    assetChainAddress: string;
  }) => {
    const runeMemberData = await midgardApi.getMemberDetail(thorchainAddress);
    const assetMemberData = await midgardApi.getMemberDetail(assetChainAddress);

    return {
      runeMemberData,
      assetMemberData,
    };
  },
);

export const pollUpgradeTx = createAsyncThunk(
  'midgard/pollUpgradeTx',
  async (txTracker: TxTracker) => {
    const {
      submitTx: {recipient},
    } = txTracker;

    if (recipient) {
      const response = await midgardApi.getActions({
        limit: 1,
        offset: 0,
        address: recipient,
        type: ActionTypeEnum.Switch,
      });
      return response;
    }

    throw Error('no recipient');
  },
);

export const pollTx = createAsyncThunk(
  'midgard/pollTx',
  async (txTracker: TxTracker) => {
    let txId = txTracker.submitTx?.txID;

    if (txId && txId.includes('0x')) {
      txId = txId.slice(2);
    }

    const response = await midgardApi.getActions({
      limit: 1,
      offset: 0,
      txId,
    });

    // NOTE: There is an intermitent issue with affiliate fees, that cause the tx to be wrong at some
    // point, so we will exclude all those transactions where the affiliate address is present
    const action = response.actions[0];

    if (!action) {
      return;
    }

    if (
      action.in.some(inTx => inTx.address === config.affiliateAddress) ||
      action.out.some(outTx => outTx.address === config.affiliateAddress)
    ) {
      return;
    }

    return response;
  },
);

export const pollApprove = createAsyncThunk(
  'midgard/pollApprove',
  async (txTracker: TxTracker) => {
    const assetString = txTracker.submitTx?.inAssets?.[0]?.asset;

    if (!assetString) {
      throw Error('invalid asset string');
    }

    const asset = Asset.fromAssetString(assetString);

    if (!asset) {
      throw Error('invalid asset');
    }

    const approved = await multichain.isAssetApproved(asset);

    return {
      asset,
      approved,
    };
  },
);

export const getMimir = createAsyncThunk(
  'thorchain/getThorchainMimir',
  async () => {
    const {data} = await getThorchainMimir();

    return data;
  },
);

// get 24h volume
export const getVolume24h = createAsyncThunk(
  'midgard/getVolume24h',
  async () => {
    const {intervals: swapIntervals} = await midgardApi.getSwapHistory({
      query: {
        interval: 'day',
        count: 2,
      },
    });

    const {intervals: liquidityIntervals} =
      await midgardApi.getLiquidityHistory({
        query: {
          interval: 'day',
          count: 2,
        },
      });

    // swap + add + withdraw
    const volume24h =
      Number(swapIntervals[0].totalVolume) +
      Number(liquidityIntervals[0].addLiquidityVolume) +
      Number(liquidityIntervals[0].withdrawVolume);

    return volume24h;
  },
);

// get 24h volume
export const getThorchainInboundData = createAsyncThunk(
  'thornode/getInboundData',
  async () => {
    const {data} = await getInboundData();

    return data;
  },
);

// get liquidity provider
export const getLiquidityProviderData = createAsyncThunk(
  'thornode/getLiquidityProvider',
  async ({address, asset}: {asset: string; address: string}) => {
    const {data} = await getLiquidityProvider({asset, address});

    return data;
  },
);

export const approveAssetPollResponse = createAsyncThunk<
  AssetApproval,
  AssetApproval,
  {rejectValue: string}
>('approveAssetPollResponse', async (assetApproval: AssetApproval) => {
  return assetApproval;
});

export const approveAssetPoll = createAsyncThunk<
  undefined,
  Asset,
  {rejectValue: string}
>('approveAssetPoll', async (asset: Asset, {dispatch, rejectWithValue}) => {
  try {
    const pollAsset = async (calls = 0) => {
      const isApproved = await multichain.isAssetApproved(asset);
      calls++;

      // Poll every 20 seconds for 3 minutes
      if (calls <= 9 && !isApproved) {
        setTimeout(() => pollAsset(calls), 20000);
      } else {
        dispatch(
          approveAssetPollResponse({
            asset: asset.ticker,
            isApproved,
            inProgress: false,
          }),
        );
      }
    };

    await pollAsset();
  } catch {
    return rejectWithValue(asset.ticker);
  }
});
