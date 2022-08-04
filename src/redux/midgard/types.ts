import {Chain} from '@thorwallet/xchain-util';
import BigNumber from 'bignumber.js';
import {
  StatsData,
  Network,
  Constants,
  Queue,
  PoolStatsDetail,
  DepthHistory,
  EarningsHistory,
  SwapHistory,
  LiquidityHistory,
  ActionsList,
  MemberDetails,
  Action,
  Coin,
  MemberPool,
  InboundAddressesItem,
  TVLHistory,
  LastblockItem,
} from '../../SDKs/midgard-sdk';
import {Amount, Asset, Pool, Price} from '../../SDKs/multichain-sdk';

export enum TxTrackerStatus {
  Submitting = 'Submitting',
  Pending = 'Pending',
  Success = 'Success',
  Failed = 'Failed',
}

// TxTrackerType has additional Approve value
export enum TxTrackerType {
  Approve = 'Approve',
  Swap = 'swap',
  AddLiquidity = 'addLiquidity',
  Withdraw = 'withdraw',
  Donate = 'donate',
  Refund = 'refund',
  Switch = 'switch',
  Mint = 'mint',
  Redeem = 'redeem',
  Send = 'send',
}

export interface SubmitTx {
  inAssets?: Coin[];
  outAssets?: Coin[];
  txID?: string;
  submitDate?: Date;
  recipient?: string;
  poolAsset?: string;
  addTx?: {
    runeTxID?: string;
    assetTxID?: string;
  };
  withdrawChain?: Chain; // chain for asset used for withdraw tx
  transactionUrl?: string;
}

export interface TxTracker {
  uuid: string;
  type: TxTrackerType;
  status: TxTrackerStatus;
  submitTx: SubmitTx;
  action: Action | null;
  refunded: boolean | null;
  transactionUrl?: string;
}

export type MemberDetailsLiquidityStats = {
  pool: string;
  addedRune: number;
  addedAsset: number;
  addedValueInRune?: number;
  addedValueInUSD: number;
  withdrawnRune: number;
  withdrawnAsset: number;
  withdrawnValueInRune?: number;
  withdrawnValueInUSD: number;
  redeemableRune: number;
  redeemableAsset: number;
  realizedReturnValueInRune?: number;
  reedeemableValueInRune?: number;
  totalReturnValueInRune?: number;
};

export type MemberDetailsPositionStats = {
  pool: string;
  addedValue: BigNumber;
  assetGainLoss: BigNumber;
  assetTicker: string;
  currentValue: BigNumber;
  formattedDate: string;
  gainLoss: BigNumber;
  gainLossUSD: BigNumber;
  liquidityRuneAdded: BigNumber;
  liquidityAssetAdded: BigNumber;
  redeemableAsset: BigNumber;
  redeemableRune: BigNumber;
  runeGainLoss: BigNumber;
  totalDays: number;
  withdrawnValue: BigNumber;
};

export type PortfolioOverview = {
  totalCurrentValue: BigNumber;
  totalAddedValue: BigNumber;
  totalWithdrawnValue: BigNumber;
  totalGainLoss: BigNumber;
};

export interface AssetRunePriceHistory {
  [key: string]: any;
}

export interface AssetBalance {
  asset: Asset;
  balance: Amount;
  priceUsd: Price;
}

export type MemberPoolData = {
  pool: Pool;
  liquidityUnits: string;
};

export type LiquidityParams = {
  pool: Pool;
  runePriceHistory: AssetRunePriceHistory;
  liquidityUnits: string;
};

// Record<asset, tracker status>
export type ApproveStatus = Record<string, TxTrackerStatus>;

export type MimirData = {
  CHURNINTERVAL?: number;
  FUNDMIGRATIONINTERVAL?: number;
  MINIMUMBONDINRUNE?: number;
  MINRUNEPOOLDEPTH?: number;
  NEWPOOLCYCLE?: number;
  ROTATEPERBLOCKHEIGHT?: number;
  MAXLIQUIDITYRUNE?: number;
  MAXIMUMLIQUIDITYRUNE?: number;
  BADVALIDATORREDLINE?: number;
  EMISSIONCURVE?: number;
  FULLIMPLOSSPROTECTIONBLOCKS?: number;
  HALTBCHCHAIN?: number;
  HALTBCHTRADING?: number;
  HALTGAIATRADING?: number;
  HALTBNBCHAIN?: number;
  HALTBNBTRADING?: number;
  HALTBTCCHAIN?: number;
  HALTBTCTRADING?: number;
  HALTETHCHAIN?: number;
  HALTETHTRADING?: number;
  HALTDOGETRADING?: number;
  HALTDOGECHAIN?: number;
  HALTLTCCHAIN?: number;
  HALTLTCTRADING?: number;
  HALTGAIACHAIN?: number;
  HALTTHORCHAIN?: number;
  HALTTRADING?: number;
  HALTTERRACHAIN?: number;
  HALTTERRATRADING?: number;
  MAXUTXOSTOSPEND?: number;
  MINTSYNTHS?: number;
  NUMBEROFNEWNODESPERCHURN?: number;
  OBSERVATIONDELAYFLEXIBILITY?: number;
  PAUSELP?: number;
  PAUSELPBCH?: number;
  PAUSELPBNB?: number;
  PAUSELPBTC?: number;
  PAUSELPETH?: number;
  PAUSELPLTC?: number;
  PAUSELPDOGE?: number;
  POOLCYCLE?: number;
  STOPFUNDYGGDRASIL?: number;
  STOPSOLVENCYCHECK?: number;
  THORNAME?: number;
  THORNAMES?: number;
  YGGFUNDRETRY?: number;
};

export type ShareType = 'sym' | 'runeAsym' | 'assetAsym';

export enum PoolShareType {
  'SYM' = 'SYM',
  'RUNE_ASYM' = 'RUNE_ASYM',
  'ASSET_ASYM' = 'ASSET_ASYM',
}

// Pool Member Data for sym, runeAsym, assetAsym
export type PoolMemberData = {
  sym?: MemberPool;
  runeAsym?: MemberPool;
  assetAsym?: MemberPool;
};

// Record<poolString, PoolMemberData>
export type ChainMemberData = Record<string, PoolMemberData>;

// Record<chainString, ChainMemberData>
export type ChainMemberDetails = Record<string, ChainMemberData>;

// Record<chainString, boolean>
export type ChainMemberDetailsLoading = Record<string, boolean>;

export type LiquidityProvider = {
  asset: string;
  rune_address?: string;
  asset_address?: string;
  last_add_height: number;
  units: string;
  pending_rune: string;
  pending_asset: string;
  pending_tx_Id?: string;
  rune_deposit_value: string;
  asset_deposit_value: string;
};

export type PendingLP = Record<string, LiquidityProvider>;

export type LpChartData = {
  date: Date;
  value: string;
};

export type PoolMarketCap = {
  pool: Pool;
  marketCap: number;
};

export type LiquidityValues = {
  hour: LpChartData[];
  day: LpChartData[];
  month: LpChartData[];
  year: LpChartData[];
};

export enum Interval {
  hour = '1h',
  day = '1d',
  month = '1m',
  year = '1y',
}

export interface IntervalValue {
  key: string;
  value: BigNumber;
  valueUsd: string;
}

/**
 * Defines the interval information that can be hourly, daily, monthly and yearly
 */
export interface IntervalData {
  /**
   * Interval starting date
   */
  startDate: Date;
  /**
   * Interval starting date timestamp
   */
  startTimestamp: number;
  /**
   * Interval end date timestamp
   */
  endTimestamp: number;
  /**
   * Increment in seconds on each interval iteration
   * @example For monthly intervals, the increment will be 24 * 60 * 60 (86400s = 1day)
   */
  increment: number;
  /**
   * Increment limit on each interval iteration.
   * @example For monthly intervals, the increment limit will be 24 * 60 * 60 - 1 (86399s = 23h, 59m, 59s)
   */
  incrementLimit: number;
}

export interface LpChartInterval {
  startIntervalTimestamp: number;
  endIntervalTimestamp: number;
  value: BigNumber;
  valueUsd: string;
  liquidityUnits: BigNumber;
  assetPrice: BigNumber;
  assetPriceUsd: BigNumber;
  assetDepth: BigNumber;
  runeDepth: BigNumber;
}

export interface LpChartIntervals {
  [key: string]: LpChartInterval;
}

export interface AssetApproval {
  asset: string;
  inProgress: boolean;
  isApproved: boolean;
}

export interface LpPosition {
  pool: string;
  symbol: string;
  currentValue: number;
}

export interface State {
  assets: Asset[];
  pools: PoolMarketCap[];
  poolLoading: boolean;
  isLpChartLoading: boolean;
  memberDetails: MemberDetails;
  memberDetailsLoading: boolean;
  memberDetailsLiquidityStats: MemberDetailsLiquidityStats[];
  memberDetailsPositionStats: MemberDetailsPositionStats[];
  chainMemberDetails: ChainMemberDetails;
  chainMemberDetailsLoading: ChainMemberDetailsLoading;
  poolStats: PoolStatsDetail | null;
  poolStatsLoading: boolean;
  depthHistory: DepthHistory | null;
  depthHistoryLoading: boolean;
  earningsHistory: EarningsHistory | null;
  earningsHistoryLoading: boolean;
  tvlHistory: TVLHistory | null;
  tvlHistoryLoading: boolean;
  swapHistory: SwapHistory | null;
  swapGlobalHistory: SwapHistory | null;
  swapHistoryLoading: boolean;
  liquidityHistory: LiquidityHistory | null;
  liquidityGlobalHistory: LiquidityHistory | null;
  liquidityHistoryLoading: boolean;
  liquidityChartData: LpChartData[];
  lpChartCurrentValueChange: BigNumber;
  lpPositions: LpPosition[];
  stats: StatsData | null;
  networkData: Network | null;
  constants: Constants | null;
  queue: Queue | null;
  txData: ActionsList;
  txActions: Action[];
  txDataLoading: boolean;
  txTrackers: TxTracker[];
  newTxTrackers: TxTracker[];
  txCollapsed: boolean;
  mimirLoading: boolean;
  mimir: MimirData;
  approveStatus: ApproveStatus;
  volume24h: number | null;
  inboundData: InboundAddressesItem[];
  pendingLP: PendingLP;
  pendingLPLoading: boolean;
  lastBlock: LastblockItem[];
  assetApprovals: AssetApproval[];
}
