import {Chain} from '@thorwallet/xchain-util';
import BigNumber from 'bignumber.js';
import {ActionTypeEnum} from '../SDKs/midgard-sdk';
import {
  Amount,
  AmountType,
  Asset,
  DefispotChain,
  getContractAddressFromAsset,
  NewChain,
  Pool,
} from '../SDKs/multichain-sdk';

import {
  bnbIcon,
  btcIcon,
  nativeRuneIcon,
  tgtLogoIcon,
  ustLogoIcon,
  razeLogo,
  busdIcon,
  bchIcon,
  ltcIcon,
  dogeIcon,
  ethIcon,
  atomLogoIcon,
} from '../components/Icons';

import {IS_TESTNET} from '../settings/config';
import {assetIconMap} from '../settings/logoData';

import {ReactComponent as SwapIcon} from '../assets/icons/general/swap.svg';

export const getAssetIconUrl = (asset: Asset): string => {
  if (asset.isRUNE()) {
    return nativeRuneIcon;
  }
  // eslint-disable-next-line default-case
  switch (asset.ticker) {
    case 'ATOM':
      return atomLogoIcon;
    case 'BTC':
      return btcIcon;
    case 'ETH':
      return ethIcon;
    case 'DOGE':
      return dogeIcon;
    case 'LTC':
      return ltcIcon;
    case 'BCH':
      return bchIcon;
    case 'TGT':
      return tgtLogoIcon;
    case 'BNB':
      return bnbIcon;
    case 'BUSD':
      return busdIcon;
    case 'UST':
      return ustLogoIcon;
    case 'RAZE':
      return razeLogo;
    default:
      return getIconfromExteralSource(asset);
  }
};

const getIconfromExteralSource = (asset: Asset) => {
  if (asset.chain === 'ETH' && asset.ticker !== 'ETH') {
    if (!IS_TESTNET) {
      const contract = getContractAddressFromAsset(asset);
      if (asset.ticker === 'ALCX') {
        return 'https://etherscan.io/token/images/Alchemix_32.png';
      }
      return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${contract}/logo.png`;
    }
    // ethereum logos
    if (asset.ticker === 'WETH') {
      return 'https://assets.coingecko.com/coins/images/2518/large/weth.png';
    }
    if (asset.ticker === 'DAI') {
      return 'https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_DAI.svg';
    }
  }
  const logoSymbol = assetIconMap[asset.ticker];
  if (logoSymbol) {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/${logoSymbol}/logo.png`;
  }
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/${asset.symbol}/logo.png`;
};

export const getChainIconUrl = (chain: DefispotChain): string => {
  switch (chain) {
    case Chain.Binance:
      return getAssetIconUrl(Asset.BNB());
    case Chain.BitcoinCash:
      return getAssetIconUrl(Asset.BCH());
    case Chain.Ethereum:
      return getAssetIconUrl(Asset.ETH());
    case Chain.Doge:
      return getAssetIconUrl(Asset.DOGE());
    case Chain.Litecoin:
      return getAssetIconUrl(Asset.LTC());
    case Chain.THORChain:
      return getAssetIconUrl(Asset.RUNE());
    case Chain.Bitcoin:
      return getAssetIconUrl(Asset.BTC());
    case NewChain.BinanceSmartChain:
      return ' https://s2.coinmarketcap.com/static/img/coins/64x64/.png';
    case Chain.Cosmos:
      return getAssetIconUrl(Asset.ATOM());
    default:
      return assetIconMap[chain];
  }
};

export const getIconByTxType = (type: ActionTypeEnum) => {
  switch (type) {
    case ActionTypeEnum.AddLiquidity:
    case ActionTypeEnum.Donate:
    case ActionTypeEnum.Refund:
    case ActionTypeEnum.Swap:
    case ActionTypeEnum.Switch:
    case ActionTypeEnum.Withdraw:
    default:
      return SwapIcon;
  }
};

export const isAmbiguousAsset = (asset: Asset): boolean => {
  return asset.ticker === 'ETH';
};

export const isL1Asset = (asset: Asset): boolean => {
  return (
    asset.ticker === asset.chain ||
    asset.ticker === 'RUNE' ||
    asset.ticker === 'LUNA' ||
    asset.ticker === 'ATOM'
  );
};
export const getMaxSymAmounts = ({
  assetAmount,
  runeAmount,
  pool,
}: {
  assetAmount: Amount;
  runeAmount: Amount;
  pool: Pool;
}) => {
  const symAssetAmount = runeAmount.mul(pool.runePriceInAsset);

  if (symAssetAmount.gt(assetAmount)) {
    const maxSymAssetAmount = assetAmount;
    const maxSymRuneAmount = maxSymAssetAmount.mul(pool.assetPriceInRune);

    return {
      maxSymAssetAmount,
      maxSymRuneAmount,
    };
  }
  const maxSymAssetAmount = symAssetAmount;
  const maxSymRuneAmount = runeAmount;

  return {
    maxSymAssetAmount,
    maxSymRuneAmount,
  };
};

export const sumBigNumbersToAbbreviate = (
  amounts: BigNumber[],
  decimals = 2,
) => {
  const sum = amounts.reduce((previous, current) =>
    new BigNumber(previous).plus(current),
  );
  return bigNumberToAbbreviate(sum, decimals, AmountType.ASSET_AMOUNT);
};

export const bigNumberToAbbreviate = (
  value?: BigNumber,
  decimals = 8,
  amountType = AmountType.BASE_AMOUNT,
) => {
  if (!value) {
    return Amount.fromBaseAmount(new BigNumber(0), 8).toAbbreviate(decimals);
  }

  if (amountType === AmountType.BASE_AMOUNT) {
    return Amount.fromBaseAmount(value, 8).toAbbreviate(decimals);
  }

  return Amount.fromAssetAmount(value, 8).toAbbreviate(decimals);
};

export const bigNumberToFixed = (
  value?: BigNumber,
  decimals = 8,
  amountType = AmountType.BASE_AMOUNT,
) => {
  if (!value || value.isNaN()) {
    return '0';
  }

  if (amountType === AmountType.BASE_AMOUNT) {
    return Amount.fromBaseAmount(value, 8).toFixed(decimals);
  }

  return Amount.fromAssetAmount(value, 8).toFixed(decimals);
};

export const getAmountDecimals = (
  amount: number,
  decimals = 2,
  removeLeadingZeros = true,
) => {
  const value = (amount % 1).toFixed(decimals);
  if (removeLeadingZeros) {
    return value.replace(/^0+/, '');
  }
  return value;
};
