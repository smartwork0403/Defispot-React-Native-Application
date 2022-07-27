import {createAsyncThunk} from '@reduxjs/toolkit';
import {Chain} from '@thorwallet/xchain-util';
import {Asset, SupportedChain} from '../../SDKs/multichain-sdk';

import * as walletActions from '../wallet/actions';

import serverService from './server.service';
import {AssetInfo} from './types';

export const fetchAllAssets = createAsyncThunk<AssetInfo[]>(
  'server/fetchAllAssets',
  async () => {
    const assets = await serverService.fetchAllAssets();

    return assets;
  },
);

export const getAssetCurrentPriceData = createAsyncThunk(
  'server/getAssetCurrentPriceData',
  async (assets: Asset[]) => {
    return serverService.getAssetCurrentPriceData(assets);
  },
);

export const findAssetsByChain = createAsyncThunk(
  'server/findAssetsByChain',
  async (chain: Chain) => {
    return serverService.findAssetsByChain(chain);
  },
);
export const findAssetsByChainAndGetBalances = createAsyncThunk(
  'server/findAssetsByChainAndGetBalances',
  async (chain: Chain, {dispatch}) => {
    const assetData = await serverService.findAssetInfoByChain(chain);

    dispatch(
      walletActions.getWalletByChain({
        chain: chain as SupportedChain,
      }),
    );
    return assetData;
  },
);

export const getFluctuationsLast24Hrs = createAsyncThunk(
  'server/getFluctuationsLast24Hrs',
  async () => {
    return serverService.getFluctuationsLast24Hrs();
  },
);

export const getAssetMetadata = createAsyncThunk(
  'server/getAssetMetadata',
  async () => {
    return serverService.getAssetMetadata();
  },
);

// export const findMyAffiliateInfo = createAsyncThunk(
//   'server/findMyAffiliateInfo',
//   async (terraAddress: string) => {
//     const referralCode = await serverService.signupAffiliateInfo(terraAddress)
//     return serverService.findAffiliateInfo(
//       referralCode.affiliateAddress.substring(
//         referralCode.affiliateAddress.length - 10,
//       ),
//     )
//   },
// )
export const findReferringAffiliateInfo = createAsyncThunk(
  'server/findReferringAffiliateInfo',
  async (referralCode: string) => {
    return serverService.findAffiliateInfo(referralCode);
  },
);
