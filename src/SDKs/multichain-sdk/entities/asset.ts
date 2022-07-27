import {EtherscanProvider} from '@ethersproject/providers';
import {AssetAtom} from '@thorwallet/xchain-cosmos';
import {getDecimal} from '@thorwallet/xchain-ethereum';
import {
  BNBChain,
  BTCChain,
  THORChain,
  ETHChain,
  LTCChain,
  DOGEChain,
  Chain,
  AssetBNB,
  AssetBTC,
  AssetETH,
  AssetLTC,
  AssetBCH,
  AssetDOGE,
  AssetRuneNative,
  BCHChain,
  // AssetUST,
  Asset as AssetObj,
  CosmosChain,
} from '@thorwallet/xchain-util';

import {ETHERSCAN_API_KEY, NETWORK_TYPE} from '../../multichain-sdk/config';

import {getAssetType, getAssetName, getNetworkName} from '../constants/chains';
import {
  DEFAULT_CHAIN_DECIMAL,
  THORCHAIN_DECIMAL,
  BNB_DECIMAL,
  BTC_DECIMAL,
  ETH_DECIMAL,
  LTC_DECIMAL,
  DOGE_DECIMAL,
  BCH_DECIMAL,
  ATOM_DECIMAL,
} from '../constants/decimals';

export type Protocol = 'thorchain' | 'anyswap' | 'chainflip' | 'sifchain';

export interface IAsset {
  readonly protocols: Protocol[];
  readonly chain: Chain;
  readonly symbol: string;
  readonly ticker: string;
  readonly type: string;
  readonly name: string;
  readonly network: string;

  decimal: number;

  synth: boolean;

  getAssetObj(): AssetObj;
  toString(): string;
  currencySymbol(): string;
  eq(asset: Asset): boolean;
  isRUNE(): boolean;
  isBNB(): boolean;
  sortsBefore(asset: Asset): number;
}

/**
 * L1 asset format:
 * - CHAIN.SYMBOL (Raw string, URL)
 * Synth asset format: CHAIN/SYMBOL
 * - CHAIN/SYMBOL (Raw string)
 * - THOR.CHAIN.SYMBOL (URL)
 */
const AssetUST: AssetObj = {
  chain: Chain.Terra,
  symbol: 'UST',
  ticker: 'UST',
  synth: false,
};

const AssetBUSD: AssetObj = {
  chain: Chain.Binance,
  symbol: 'BUSD-BD1',
  ticker: 'BUSD',
  synth: false,
};

export class Asset implements IAsset {
  public readonly chain: Chain;

  public readonly symbol: string;

  public readonly ticker: string;

  public readonly type: string;

  public readonly network: string;

  public readonly name: string;

  public readonly protocols: Protocol[];

  public decimal: number;

  public synth = false;

  // created for USD pricing
  public static USD(): Asset {
    return new Asset(THORChain, 'USD-USD');
  }

  public static BNB(): Asset {
    return new Asset(AssetBNB.chain, AssetBNB.symbol);
  }

  public static RUNE(): Asset {
    return new Asset(AssetRuneNative.chain, AssetRuneNative.symbol);
  }

  public static BNB_RUNE(): Asset {
    return new Asset(AssetBNB.chain, AssetRuneNative.symbol);
  }

  public static BUSD(): Asset {
    return new Asset(AssetBNB.chain, AssetBUSD.symbol);
  }

  public static ETH_RUNE(): Asset {
    return new Asset(AssetRuneNative.chain, AssetRuneNative.symbol);
  }

  public static BTC(): Asset {
    return new Asset(AssetBTC.chain, AssetBTC.symbol);
  }

  public static ETH(): Asset {
    return new Asset(AssetETH.chain, AssetETH.symbol);
  }

  public static LTC(): Asset {
    return new Asset(AssetLTC.chain, AssetLTC.symbol);
  }

  public static BCH(): Asset {
    return new Asset(AssetBCH.chain, AssetBCH.symbol);
  }

  // public static BSC(): Asset {
  //   return new Asset(AssetBCH.chain, AssetBCH.symbol)
  // }

  public static DOGE(): Asset {
    return new Asset(AssetDOGE.chain, AssetDOGE.symbol);
  }

  public static ATOM(): Asset {
    return new Asset(AssetAtom.chain, AssetAtom.symbol);
  }

  public static RAZE(): Asset {
    return new Asset(AssetETH.chain, 'RAZE');
  }

  public static fromAssetString(asset: string): Asset | null {
    let chain: Chain;
    let symbol: string;
    let synth: boolean;

    // check if synth or not
    if (asset.includes('/')) {
      chain = asset.split('/')[0] as Chain;
      symbol = asset.split('/')[1];

      synth = true;
    } else {
      chain = asset.split('.')[0] as Chain;
      symbol = asset.split('.')[1];

      synth = false;
    }

    const ticker = symbol.split('-')?.[0];

    if (chain && symbol && ticker) {
      return new Asset(chain, symbol, synth);
    }

    return null;
  }

  /**
   *
   * @param urlEncodedAsset asset string from url
   * @returns btc.btc -> btc.btc, thor.btc.btc -> btc/btc
   */
  public static decodeFromURL = (urlEncodedAsset: string): Asset | null => {
    let assetString = urlEncodedAsset.toUpperCase();

    if (
      assetString.startsWith('THOR.') &&
      assetString.split('THOR.')?.[1] !== 'RUNE'
    ) {
      // synth asset
      assetString = assetString.split('THOR.')?.[1]?.replace('.', '/');
    }

    return Asset.fromAssetString(assetString);
  };

  public static async getDecimalByAsset(asset: Asset): Promise<number> {
    const {chain, symbol, ticker, synth} = asset;

    if (synth) return THORCHAIN_DECIMAL;

    if (chain === BNBChain) return BNB_DECIMAL;
    if (chain === BTCChain) return BTC_DECIMAL;
    if (chain === THORChain) return THORCHAIN_DECIMAL;
    if (chain === LTCChain) return LTC_DECIMAL;
    if (chain === BCHChain) return BCH_DECIMAL;
    if (chain === DOGEChain) return DOGE_DECIMAL;
    // TODO: different cosmos assets may have diffent exponent
    if (chain === CosmosChain) return ATOM_DECIMAL;
    if (chain === ETHChain) {
      if (symbol === 'ETH' && ticker === 'ETH') {
        return ETH_DECIMAL;
      }

      const provider = new EtherscanProvider(NETWORK_TYPE, ETHERSCAN_API_KEY);
      const decimal = await getDecimal(asset.getAssetObj(), provider);

      return decimal;
    }

    return DEFAULT_CHAIN_DECIMAL;
  }

  public static getDecimalByChain(chain: Chain): number {
    if (chain === BNBChain) return BNB_DECIMAL;
    if (chain === BTCChain) return BTC_DECIMAL;
    if (chain === THORChain) return THORCHAIN_DECIMAL;
    if (chain === LTCChain) return LTC_DECIMAL;
    if (chain === BCHChain) return BCH_DECIMAL;
    if (chain === DOGEChain) return DOGE_DECIMAL;
    if (chain === CosmosChain) return ATOM_DECIMAL;
    if (chain === ETHChain) {
      return ETH_DECIMAL;
    }

    return DEFAULT_CHAIN_DECIMAL;
  }

  constructor(chain: Chain, symbol: string, synth = false) {
    this.chain = chain;
    this.symbol = symbol;
    this.ticker = Asset.getTicker(symbol);
    this.type = getAssetType(chain, this.ticker, synth);
    this.name = getAssetName(chain, this.ticker, synth);
    this.network = getNetworkName(chain, this.ticker);
    this.protocols = getSupportedProtocols(chain, this.ticker);
    this.decimal = synth ? THORCHAIN_DECIMAL : Asset.getDecimalByChain(chain);
    this.synth = synth;
    this.synth = synth;
  }

  /**
   * THORChain for Synth assets
   * L1 chain for non-synth assets
   */
  get L1Chain(): Chain {
    if (this.synth) return THORChain;

    return this.chain;
  }

  public setDecimal = async (decimal?: number) => {
    if (decimal !== undefined) {
      this.decimal = decimal;
    } else {
      this.decimal = await Asset.getDecimalByAsset(this);
    }
  };

  public static getTicker(symbol: string): string {
    return symbol.split('-')[0];
  }

  /**
   * @returns get asset object to be used for xchainjs
   */
  public getAssetObj(): AssetObj {
    // TODO:  synth format
    if (this.synth) {
      const synthSymbol = `${this.chain.toUpperCase()}/${this.symbol.toUpperCase()}`;

      return {
        chain: THORChain as Chain,
        symbol: synthSymbol,
        ticker: synthSymbol,
        synth: true,
      };
    }

    // L1 format: BTC.BTC
    return {
      chain: this.chain,
      symbol: this.symbol,
      ticker: this.ticker,
      synth: false,
    };
  }

  /**
   * convert asset entity to string
   * @returns L1 asset -> btc.btc, Synth asset -> btc/btc
   */
  toString(): string {
    if (!this.synth) {
      return `${this.chain}.${this.symbol}`;
    }

    return `${this.chain}/${this.symbol}`;
  }

  toURLEncoded(): string {
    if (!this.synth) {
      return `${this.chain}.${this.symbol}`;
    }

    return `THOR.${this.chain}.${this.symbol}`;
  }

  currencySymbol(): string {
    return this.ticker;
    // return currencySymbolByAsset(this.getAssetObj())
  }

  // full compare chain, symbol, synth
  eq(asset: Asset): boolean {
    return (
      this.chain === asset.chain &&
      this.symbol.toUpperCase() === asset.symbol.toUpperCase() &&
      this.ticker.toUpperCase() === asset.ticker.toUpperCase() &&
      this.synth === asset.synth
      // this.decimal === asset.decimal
    );
  }

  // compare chain, symbol but not synth
  shallowEq(asset: Asset): boolean {
    return (
      this.chain === asset.chain &&
      this.symbol.toUpperCase() === asset.symbol.toUpperCase() &&
      this.ticker.toUpperCase() === asset.ticker.toUpperCase()
    );
  }

  isGasAsset = (): boolean => {
    return (
      this.eq(Asset.RUNE()) ||
      this.eq(Asset.ETH()) ||
      this.eq(Asset.BTC()) ||
      this.eq(Asset.BNB()) ||
      this.eq(Asset.BCH()) ||
      this.eq(Asset.LTC()) ||
      this.eq(Asset.DOGE()) ||
      this.eq(Asset.ATOM())
    );
  };

  isRUNE(): boolean {
    return this.eq(Asset.RUNE());
  }

  isLTC(): boolean {
    return this.eq(Asset.LTC());
  }

  isBTC(): boolean {
    return this.eq(Asset.BTC());
  }

  isBNB(): boolean {
    return this.eq(Asset.BNB());
  }

  isETH(): boolean {
    return this.eq(Asset.ETH());
  }

  isDOGE(): boolean {
    return this.eq(Asset.DOGE());
  }

  isAtom(): boolean {
    return this.eq(Asset.ATOM());
  }

  isRAZE(): boolean {
    return this.eq(Asset.RAZE());
  }

  isNative(): boolean {
    return (
      this.eq(Asset.BTC()) ||
      this.eq(Asset.ETH()) ||
      this.eq(Asset.BNB()) ||
      this.eq(Asset.DOGE()) ||
      this.eq(Asset.LTC()) ||
      this.eq(Asset.BCH()) ||
      this.eq(Asset.ATOM())
    );
  }

  sortsBefore(asset: Asset): number {
    if (this.eq(asset)) return 0;

    if (this.synth) return 1;

    if (this.chain !== asset.chain) {
      if (this.chain < asset.chain) return -1;
      if (this.chain > asset.chain) return 1;
    }

    if (this.symbol < asset.symbol) return -1;
    if (this.symbol > asset.symbol) return 1;

    return 1;
  }
}
function getSupportedProtocols(chain: string, ticker: string): Protocol[] {
  if (chain && ticker) {
    return ['thorchain'];
  }
  return ['thorchain'];
}
