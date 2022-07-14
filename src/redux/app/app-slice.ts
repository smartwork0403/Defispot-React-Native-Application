import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {FeeOption} from '@xchainjs/xchain-client';
import {AppStateModel} from '../../models/AppStateModel';
import {Asset} from '../../SDKs/multichain-sdk';

// import {getInitialThemeColor} from '..hooks/useTheme';

import {
  saveBaseCurrency,
  getBaseCurrency,
  getReadStatus,
  setReadStatus,
} from '../../helpers/storage';

import {DEFAULT_SLIPPAGE_TOLERANCE} from '../../settings/constants';

import type {RootState} from '../store';

const initialState: AppStateModel = {
  data: [],
  // notification: {
  //   type: '',
  //   text: '',
  // },
  showAnnouncement: !getReadStatus(),
  baseCurrency: getBaseCurrency(),
  isSettingOpen: false,
  isFastSwapOpen: false,
  // theme: getInitialThemeColor(),
  slippageTolerance: DEFAULT_SLIPPAGE_TOLERANCE,
  feeOptionType: FeeOption.Fast,
  inputAsset: Asset.BUSD(),
  outputAsset: Asset.RUNE(),
  sendAsset: Asset.BTC(),
  withdrawAsset: Asset.BTC(),
  receiveAsset: Asset.BTC(),
  theme: 'light'
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setBaseCurrency(state, action: PayloadAction<Asset>) {
      const assetString = action.payload.toString();
      saveBaseCurrency(assetString);
      state.baseCurrency = assetString;
    },
    setSettingsOpen(state, action: PayloadAction<boolean>) {
      state.isSettingOpen = action.payload;
    },
    toggleSettings(state) {
      state.isSettingOpen = !state.isSettingOpen;
    },
    toggleFastSwap(state) {
      state.isFastSwapOpen = !state.isFastSwapOpen;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
    },
    setSlippageTolerance(state, action: PayloadAction<number>) {
      state.slippageTolerance = action.payload;
    },
    setSlippage(state, action: PayloadAction<number>) {
      const slippage =
        action.payload > 100 ? 100 : action.payload < 0 ? 0 : action.payload;

      state.slippageTolerance = slippage;
    },
    setFeeOptionType(state, action: PayloadAction<FeeOption>) {
      state.feeOptionType = action.payload;
    },
    setReadStatus(state, action: PayloadAction<boolean>) {
      state.showAnnouncement = !action.payload;
      setReadStatus(action.payload);
    },
    setInputAsset(state, action: PayloadAction<Asset>) {
      if (action.payload.eq(state.outputAsset)) {
        state.outputAsset = state.inputAsset;
      }
      state.inputAsset = action.payload;
    },
    setOutputAsset(state, action: PayloadAction<Asset>) {
      state.outputAsset = action.payload;
    },
    setSendAsset(state, action: PayloadAction<Asset>) {
      state.sendAsset = action.payload;
    },
    // setDepositAsset(state, action: PayloadAction<Asset>) {
    //   state.depositAsset = action.payload
    // },
    setWithdrawAsset(state, action: PayloadAction<Asset>) {
      state.withdrawAsset = action.payload;
    },
    setReceiveAsset(state, action: PayloadAction<Asset>) {
      state.receiveAsset = action.payload;
    },
    // setNotification(state, action) {
    //   state.notification = action.payload;
    // },
  },
});

export const {reducer: appReducer, actions} = appSlice;
export const selectState = (state: RootState) => state.app;
