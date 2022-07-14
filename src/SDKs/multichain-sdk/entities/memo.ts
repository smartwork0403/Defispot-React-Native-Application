import {Network} from '@xchainjs/xchain-client';

import {AFFILIATE_FEE} from 'multichain-sdk/config';

import {config} from 'settings/config';

import {getTradeLimitWithIdentifier} from '../utils/memo';
import {Amount} from './amount';
import {Asset} from './asset';
import {Percent} from './percent';

export class Memo {
  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getShortenedSymbol = (asset: Asset): string => {
    const {symbol, chain} = asset;

    let shortenedSymbol = symbol;
    // use shortened asset name for ERC20 tokens
    if (chain === 'ETH' && !asset.isETH()) {
      shortenedSymbol = `${asset.ticker}-${asset.symbol.slice(-3)}`;
    }

    return shortenedSymbol;
  };

  public static swapMemo(
    asset: Asset,
    address = '',
    limit?: Amount,
    network?: Network,
    srcAsset?: Asset,
    affiliate?: string,
    chargeAffiliate?: boolean,
  ) {
    const {chain} = asset;
    const limitString = getTradeLimitWithIdentifier(limit);
    const shortenedSymbol = Memo.getShortenedSymbol(asset);
    const AFFILIATE_POINTS = (AFFILIATE_FEE * 10000).toFixed();
    if (asset.synth) {
      return `=:${chain}/${shortenedSymbol}:${address}:${limitString}`;
    }
    if (
      srcAsset &&
      srcAsset?.chain !== 'BTC' &&
      srcAsset?.chain !== 'LTC' &&
      srcAsset?.chain !== 'DOGE' &&
      chargeAffiliate
    ) {
      return `=:${chain}.${shortenedSymbol}:${address}:${limitString}:${Memo.getAffiliateString(
        affiliate,
      )}:${AFFILIATE_POINTS}`;
    }

    return `=:${chain}.${shortenedSymbol}:${address}:${limitString}`;
  }

  public static getAffiliateString(affiliate?: string) {
    return affiliate || config.affiliateAddress;
  }

  public static depositMemo(asset: Asset, address = '', affiliate?) {
    const {chain, symbol} = asset;
    const AFFILIATE_POINTS = (AFFILIATE_FEE * 10000).toFixed();
    if (
      asset &&
      asset?.chain !== 'BTC' &&
      asset?.chain !== 'LTC' &&
      asset?.chain !== 'DOGE'
    ) {
      return `+:${chain}.${symbol}:${address}:${Memo.getAffiliateString(
        affiliate,
      )}:${AFFILIATE_POINTS}`;
    }
    return `+:${chain}.${symbol}:${address}`;
  }

  public static withdrawMemo(
    asset: Asset,
    percent: Percent,
    targetAsset?: Asset,
  ) {
    const {chain} = asset;
    const target = targetAsset ? `:${targetAsset.toString()}` : '';
    const shortenedSymbol = Memo.getShortenedSymbol(asset);

    // multiply percent by 100
    return `-:${chain}.${shortenedSymbol}:${percent
      .mul(100)
      .assetAmount.toNumber()}${target}`;
  }

  public static upgradeMemo(address: string) {
    return `SWITCH:${address}`;
  }
}
