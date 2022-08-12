import {
  Chain,
  BNBChain,
  BTCChain,
  ETHChain,
  LTCChain,
  BCHChain,
  THORChain,
  CosmosChain,
} from '@xchainjs/xchain-util';

export const getAssetType = (
  chain: Chain,
  ticker: string,
  synth = false,
): string => {
  let networkType: string;

  if (chain === THORChain) {
    networkType = 'THOR';
  } else if (chain === BCHChain) {
    networkType = 'BCH';
  } else if (chain === LTCChain) {
    networkType = 'LTC';
  } else if (chain === BTCChain) {
    networkType = 'BTC';
  } else if (chain === BNBChain) {
    networkType = 'BNB';
  } else if (chain === ETHChain) {
    networkType = 'ETH';
  } else if (chain === CosmosChain) {
    networkType = 'GAIA';
  } else {
    networkType = chain;
  }

  if (synth) {
    networkType = 'Synth';
  }

  return networkType;
};

export const getNetworkName = (chain: Chain, ticker: string): string => {
  if (chain === BTCChain) return 'Bitcoin';
  if (chain === LTCChain) return 'Litecoin';
  if (chain === BCHChain) return 'Bitcoin Cash';
  // if (chain === DOGEChain) return 'Dogecoin';
  if (chain === CosmosChain) return 'Gaia';
  if (chain === ETHChain && ticker === 'ETH') {
    return 'Ethereum';
  }

  return ticker;
};

export const getAssetName = (
  chain: Chain,
  ticker: string,
  synth = false,
): string => {
  return synth ? `Synth ${ticker}` : AssetMap[ticker.toLowerCase()];
};

// TODO: populate this map to include all assets from an endpoint.
const AssetMap = {
  btc: 'Bitcoin',
  ltc: 'Litecoin',
  usdt: 'Tether USD',
  // doge: 'Dogecoin',
  bch: 'Bitcoin Cash',
  eth: 'Ethereum',
  rune: 'THORChain',
  thor: 'THORSwap',
  raze: 'Raze Network',
  aave: 'Aave',
  wbtc: 'Wrapped Bitcoin',
  yfi: 'yearn.finance',
  sushi: 'SushiSwap',
  twt: 'Trust Wallet Token',
  hegic: 'Hegic',
  bnb: 'Binance Coin',
  usdc: 'USD Coin',
  tgt: 'THORWallet',
  kyl: 'Kylin',
  snx: 'Synthetix',
  fox: 'Shapeshift',
  ava: 'Travala.com',
  btcb: 'Bitcoin BEP2',
  xrune: 'Thorstarter',
  busd: 'Binance USD',
  dai: 'Dai',
  xdefi: 'XDEFI',
  ust: 'UST',
  mana: 'Decentraland',
  any: 'Anyswap',
  matic: 'Polygon',
  aust: 'AUST',
  uos: 'Ultra',
  atom: 'ATOM',
};
