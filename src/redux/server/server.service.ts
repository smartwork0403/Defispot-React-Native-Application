import {Asset as AssetObj, Chain} from '@thorwallet/xchain-util';
import {Asset} from '../../SDKs/multichain-sdk';

import {httpClientV2} from '../../helpers/http-client.helper';

import {
  AffiliateInfo,
  AssetInfo,
  AssetInfoMap,
  AssetMetadata,
  AssetPriceMap,
  Fluctuation,
} from './types';
// NOTE: we are getting some random mongo errors re: https://github.com/Automattic/mongoose/issues/11398,
// so added this retry to recover if they happen
async function getV2UrlWithRetry(url: string): Promise<any> {
  try {
    return await httpClientV2.get(url);
  } catch (error1) {
    handleAssetError(1, error1, url);
    // TODO this is sloppy, we should refactor this to use https://www.npmjs.com/package/axios-retry
    try {
      return await httpClientV2.get(url);
    } catch (error2) {
      handleAssetError(2, error2, url);

      try {
        return await httpClientV2.get(url);
      } catch (error3) {
        handleAssetError(3, error3, url);
      }
    }
  }
}

const handleAssetError = (retry, error, url) => {
  const safeUrls = ['asset/metadata', 'asset/current-price', '/asset'];
  const isSafe = safeUrls.findIndex(safeUrl => url.includes(safeUrl)) !== -1;

  if (isSafe && retry === 3) {
    console.warn(error);
  } else if (!isSafe) {
    console.warn(error);
  }
};

const fetchAllAssets = async (): Promise<AssetInfo[]> => {
  const response = await getV2UrlWithRetry('/asset');
  return response.data;
};

const getAssetCurrentPriceData = async (assets: Asset[]) => {
  const url = `/asset/current-price?assets=${createAssetParams(
    assets.map(a => a.getAssetObj()),
  )}`;
  const response = await getV2UrlWithRetry(url);
  return response?.data as AssetPriceMap;
};
const getAssetPriceDataByMinutes = async (minutes: number, assets: Asset[]) => {
  const url = `/asset/price-by-minute?assets=${createAssetParams(
    assets.map(a => a.getAssetObj()),
  )}&minutes=${minutes}`;
  const response = await getV2UrlWithRetry(url);
  return response?.data as AssetPriceMap;
};
const getAssetPriceDataByHours = async (hours: number, assets: Asset[]) => {
  const url = `/asset/price-by-hour?assets=${createAssetParams(
    assets.map(a => a.getAssetObj()),
  )}&hours=${hours}`;
  const response = await getV2UrlWithRetry(url);
  return response?.data;
};
const getAssetPriceDataByDays = async (days: number, assets: Asset[]) => {
  const url = `/asset/price-by-day?assets=${createAssetParams(
    assets.map(a => a.getAssetObj()),
  )}&days=${days}`;
  const response = await getV2UrlWithRetry(url);
  return response?.data;
};

const createAssetParams = (assets: AssetObj[]) =>
  assets
    .map(a => {
      return `${a.chain}.${a.symbol}`;
    })
    .join();

const findAssetsByChain = async (chain: Chain) => {
  const chainName = chain === Chain.Terra ? 'LUNA' : chain;
  const response = await getV2UrlWithRetry(`/asset/${chainName}`);
  const assetInfoMap: AssetInfoMap = {} as AssetInfoMap;
  response.data.forEach((val: AssetInfo) => {
    assetInfoMap[`${val.chain}.${val.symbol}`] = val;
  });
  return assetInfoMap;
};

const findAssetInfoByChain = async (chain: Chain): Promise<AssetInfo[]> => {
  const chainName = chain === Chain.Terra ? 'LUNA' : chain;
  const response = await getV2UrlWithRetry(`/asset/${chainName}`);
  return response?.data;
};

const getFluctuationsLast24Hrs = async (): Promise<Fluctuation[]> => {
  const response = await getV2UrlWithRetry('/fluctuations');
  return response?.data;
};

const getAssetMetadata = async (): Promise<AssetMetadata[]> => {
  const response = await getV2UrlWithRetry('/asset/metadata');
  return response?.data;
};

const findAffiliateInfo = async (
  referralCode: string,
): Promise<AffiliateInfo> => {
  const response = await getV2UrlWithRetry(`/affiliate/${referralCode}`);
  return response?.data;
};
const signupAffiliateInfo = async (
  terraAddress: string,
): Promise<AffiliateInfo> => {
  const response = await httpClientV2.post(
    `/affiliate/signup/${terraAddress}`,
    {},
  );
  return response?.data;
};

export default {
  getAssetCurrentPriceData,
  getAssetPriceDataByMinutes,
  getAssetPriceDataByHours,
  getAssetPriceDataByDays,
  fetchAllAssets,
  getAssetMetadata,
  createAssetParams,
  findAssetsByChain,
  findAssetInfoByChain,
  getFluctuationsLast24Hrs,
  findAffiliateInfo,
  signupAffiliateInfo,
};
