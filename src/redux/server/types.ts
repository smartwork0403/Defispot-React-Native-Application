export interface AssetInfo {
  cmcId: number;
  chain: string;
  symbol: string;
  asset_full_name: string;
  chain_full_name: string;
  token_address: string;
}

// enum API {
//   CMC,
// }
// export type PriceFeed = Record<API, AssetPriceData | null>

export interface AssetPriceData {
  fully_diluted_market_cap: number;
  last_updated: string;
  market_cap: number;
  market_cap_dominance: number;
  percent_change_1h: number;
  percent_change_7d: number;
  percent_change_24h: number;
  percent_change_30d: number;
  percent_change_60d: number;
  percent_change_90d: number;
  price: number;
  volume_24h: number;
  volume_change_24h: number;
}

export interface GraphByPrice {
  [key: string]: number;
}
export type GraphPortfolioData = Record<string, GraphByPrice>;
export type AssetInfoMap = Record<string, AssetInfo>;
export type AssetPriceMap = Record<string, AssetPriceData>;
export type AssetMetadataMap = Record<number, AssetMetadata>;
export type Fluctuation = {
  address: string;
  asset: string;
  rawData: string;
  change_24h: string;
  circulating_supply: string;
  biggestVal: string;
  change_7d: string;
  total_supply: string;
};

export type AssetMetadata = {
  cmcId: string;
  website: string;
  twitter: string;
  reddit: string;
  technical_doc: string;
  description: string;
  circulating_supply: number;
  max_supply: number;
  all_time_high: number;
};

export interface AffiliateInfo {
  affiliateAddress: string;
  balance: {
    runeBaseAmount: number;
    lastUpdatedTimestamp: number;
  };
}
