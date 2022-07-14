import {createSlice} from '@reduxjs/toolkit';

import type {RootState} from '../store';
import {
  fetchAllAssets,
  // findMyAffiliateInfo,
  findReferringAffiliateInfo,
  getAssetCurrentPriceData,
  getFluctuationsLast24Hrs,
  getAssetMetadata,
} from './server.actions';
import {
  AffiliateInfo,
  AssetInfo,
  AssetInfoMap,
  AssetMetadata,
  AssetMetadataMap,
  AssetPriceMap,
  Fluctuation,
  GraphPortfolioData,
} from './types';

type ServerState = {
  isLoading: boolean;
  isLoadingAffiliate: boolean;
  isLoadingMetadata: boolean;
  assetsInfo: AssetInfo[];
  assetMetadataMap: AssetMetadataMap;
  assetsInfoMap: AssetInfoMap;
  assetPriceMap: AssetPriceMap;
  referringAffiliateInfo: AffiliateInfo;
  myAffiliateInfo: AffiliateInfo;
  fluctuations: Fluctuation[];
  graphDataByHour: GraphPortfolioData[];
  graphDataByDay: GraphPortfolioData[];
  graphDataByWeek: GraphPortfolioData[];
  graphDataByMonth: GraphPortfolioData[];
  graphDataByYear: GraphPortfolioData[];
  portfolioGraphDataLoading: boolean;
};

const initialState: ServerState = {
  isLoading: false,
  isLoadingAffiliate: false,
  isLoadingMetadata: false,
  assetsInfo: [],
  assetsInfoMap: {},
  assetPriceMap: {},
  assetMetadataMap: {},
  referringAffiliateInfo: {
    affiliateAddress: '',
    balance: {runeBaseAmount: 0, lastUpdatedTimestamp: 0},
  },
  myAffiliateInfo: {
    affiliateAddress: '',
    balance: {runeBaseAmount: 0, lastUpdatedTimestamp: 0},
  },
  fluctuations: [],
  graphDataByHour: [],
  graphDataByDay: [],
  graphDataByWeek: [],
  graphDataByMonth: [],
  graphDataByYear: [],
  portfolioGraphDataLoading: false,
};

export const slice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    setPortfolioGraphData(state, action) {
      state.graphDataByHour = action.payload.dataByHour;
      state.graphDataByDay = action.payload.dataByDay;
      state.graphDataByWeek = action.payload.dataByWeek;
      state.graphDataByMonth = action.payload.dataByMonth;
      state.graphDataByYear = action.payload.dataByYear;
    },
    setPortfolioGraphDataLoading(state, action) {
      state.portfolioGraphDataLoading = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAllAssets.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllAssets.fulfilled, (state, {payload}) => {
      state.isLoading = false;
      state.assetsInfo = payload;
      const assetInfoMap: AssetInfoMap = {...state.assetsInfoMap};
      state.assetsInfo?.forEach((val: AssetInfo) => {
        if (val.chain === 'BNB') {
          if (val.token_address) {
            assetInfoMap[`${val.chain}.${val.token_address}`] = val;
          }
        }
        const tokenId = val.token_address
          ? `${val.symbol}-${val.token_address.toUpperCase()}`
          : `${val.symbol}`;
        assetInfoMap[`${val.chain}.${tokenId}`] = val;
      });
      state.assetsInfoMap = assetInfoMap;
    });
    builder.addCase(getAssetCurrentPriceData.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getAssetCurrentPriceData.fulfilled, (state, {payload}) => {
      state.isLoading = false;
      state.assetPriceMap = {...state.assetPriceMap, ...payload};
    });
    builder.addCase(getFluctuationsLast24Hrs.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(getFluctuationsLast24Hrs.fulfilled, (state, {payload}) => {
      state.isLoading = false;
      state.fluctuations = payload;
    });
    builder.addCase(getAssetMetadata.pending, state => {
      state.isLoadingMetadata = true;
    });
    builder.addCase(getAssetMetadata.fulfilled, (state, {payload}) => {
      state.isLoading = false;
      const assetMetadataMap: AssetMetadataMap = {};
      payload.forEach((val: AssetMetadata) => {
        const {cmcId} = val;
        assetMetadataMap[cmcId] = val;
      });
      state.assetMetadataMap = assetMetadataMap;
    });
    // builder.addCase(findMyAffiliateInfo.pending, (state) => {
    //   state.isLoadingAffiliate = true
    // })
    // builder.addCase(findMyAffiliateInfo.fulfilled, (state, { payload }) => {
    //   state.myAffiliateInfo = payload
    //   state.isLoadingAffiliate = false
    // })
    builder.addCase(
      findReferringAffiliateInfo.fulfilled,
      (state, {payload}) => {
        state.referringAffiliateInfo = payload;
      },
    );
  },
});

export const {reducer, actions} = slice;
export const {setPortfolioGraphData, setPortfolioGraphDataLoading} = actions;

export const selectState = (state: RootState) => state.app;
export const isLoading = (state: RootState) => state.server.isLoading;
export const selectCurrentAssetPrice = (state: RootState) =>
  state.server.assetPriceMap;
export const selectAssets = (state: RootState) => state.server.assetsInfo;
export const selectAssetsInfoMap = (state: RootState) =>
  state.server.assetsInfoMap;
export const selectFluctuations24 = (state: RootState) =>
  state.server.fluctuations;
export const selectReferringAffiliateInfo = (state: RootState) =>
  state.server.referringAffiliateInfo;
export const selectMyAffiliateInfo = (state: RootState) =>
  state.server.myAffiliateInfo;
export const selectIsLoadingAffiliate = (state: RootState) =>
  state.server.isLoadingAffiliate;
export const selectAssetMetadata = (state: RootState) =>
  state.server.assetMetadataMap;
