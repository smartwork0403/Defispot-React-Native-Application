import {Chain} from '@xchainjs/xchain-util';
import {Pool, Asset} from '../../SDKs/multichain-sdk';

export const getRuneYieldInfoRoute = ({
  chain,
  address,
}: {
  chain: Chain;
  address: string;
}) => `https://app.runeyield.info/dashboard?${chain.toLowerCase()}=${address}`;

export const HOME_ROUTE = '/';

export const TOOLS_ROUTE = '/tools';
export const EXPLORERS_ROUTE = '/explorer';
export const EDUCATION_ROUTE = '/education';
export const STATS_ROUTE = '/stats';
export const FAQS_ROUTE = '/faq';

export const TX_ROUTE = '/tx';

export const POOL_DETAIL_ROUTE = '/pool';

export const POOL_OVERVIEW_ROUTE = '/pools';
export const AFFILIATE_ROUTE = '/affiliate';
export const PORTFOLIO_ROUTE = '/portfolio';

export const getPoolDetailRoute = (pool: Pool) => {
  return `${POOL_DETAIL_ROUTE}/${pool.asset.toURLEncoded()}`;
};

export const getPoolDetailRouteFromAsset = (asset: Asset) => {
  return `${POOL_DETAIL_ROUTE}/${asset.toURLEncoded()}`;
};

export const SEND_ROUTE = '/send';

export const getSendRoute = (asset: Asset) => {
  return `${SEND_ROUTE}/${asset.toURLEncoded()}`;
};

export const UPGRADE_RUNE_ROUTE = '/upgrade_rune';

export const SWAP_ROUTE = '/swap';

export const getSwapRoute = (input: Asset, output: Asset) => {
  return `${SWAP_ROUTE}/${input.toURLEncoded()}_${output.toURLEncoded()}`;
};

export const LIQUIDITY_ROUTE = '/liquidity';

export const ADD_LIQUIDITY_ROUTE = '/add';

export const getAddLiquidityRoute = (asset: Asset) => {
  return `${ADD_LIQUIDITY_ROUTE}/${asset.toURLEncoded()}`;
};

export const CREATE_LIQUIDITY_ROUTE = '/create';

export const WITHDRAW_ROUTE = '/withdraw';

export const getWithdrawRoute = (asset: Asset) => {
  return `${WITHDRAW_ROUTE}/${asset.toURLEncoded()}`;
};
