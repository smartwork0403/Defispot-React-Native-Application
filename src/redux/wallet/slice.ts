import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {Keystore} from '@thorwallet/xchain-crypto';
import {
  BTCChain,
  BNBChain,
  THORChain,
  ETHChain,
  LTCChain,
  BCHChain,
  DOGEChain,
  CosmosChain,
} from '@thorwallet/xchain-util';

import type {RootState} from '../store';
import * as walletActions from './actions';
import {State} from './types';

const initialWallet = {
  [BTCChain]: null,
  [BNBChain]: null,
  [THORChain]: null,
  [ETHChain]: null,
  [LTCChain]: null,
  [BCHChain]: null,
  [DOGEChain]: null,
  [CosmosChain]: null,
};

const initialState: State = {
  keystore: null,
  wallet: initialWallet,
  walletLoading: false,
  chainWalletLoading: {
    [BTCChain]: false,
    [BNBChain]: false,
    [THORChain]: false,
    [ETHChain]: false,
    [LTCChain]: false,
    [BCHChain]: false,
    [DOGEChain]: false,
    [CosmosChain]: false,
  },
  isConnectWalletModalOpen: false,
  thorchainData: [],
  totalThorchainData: {
    graphData1D: [],
    graphData1Hr: [],
    graphData1M: [],
    graphData1Y: [],
  },
  thorchainLoading: false,
};

const slice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    disconnect(state) {
      state.keystore = null;
      state.wallet = initialWallet;
      state.walletLoading = false;
    },
    connectKeystore(state, action: PayloadAction<Keystore>) {
      state.keystore = action.payload;
    },
    setIsConnectWalletModalOpen(state, action: PayloadAction<boolean>) {
      state.isConnectWalletModalOpen = action.payload;
    },
    setThorchainChartData(state, action) {
      state.thorchainData = action.payload;
    },
    setTotalThorchainChartData(state, action) {
      state.totalThorchainData = action.payload;
    },
    setThorchainChartLoading(state, action) {
      state.thorchainLoading = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(walletActions.loadAllWallets.pending, state => {
        state.walletLoading = true;
      })
      .addCase(walletActions.loadAllWallets.fulfilled, (state, action) => {
        //@ts-ignore
        state.wallet = action.payload;
        state.walletLoading = false;
      })
      .addCase(walletActions.loadAllWallets.rejected, state => {
        state.walletLoading = false;
      })
      .addCase(walletActions.getWalletByChain.pending, (state, action) => {
        const {arg: chainAsset} = action.meta;

        state.chainWalletLoading = {
          ...state.chainWalletLoading,
          [chainAsset.chain]: true,
        };
      })
      .addCase(walletActions.getWalletByChain.fulfilled, (state, action) => {
        const {chain, data} = action.payload;
        if (state.wallet && chain in state.wallet) {
          state.wallet = {
            ...state.wallet,
            [chain]: data,
          };
        }

        state.chainWalletLoading = {
          ...state.chainWalletLoading,
          [chain]: false,
        };
      })
      .addCase(walletActions.getWalletByChain.rejected, (state, action) => {
        const {arg: chainAsset} = action.meta;

        state.chainWalletLoading = {
          ...state.chainWalletLoading,
          [chainAsset.chain]: false,
        };
      });
  },
});

export const {reducer, actions} = slice;
export const {
  setThorchainChartData,
  setTotalThorchainChartData,
  setThorchainChartLoading,
} = actions;
export const selectState = (state: RootState) => state.wallet;

export const selectConnectedWallets = (state: RootState) => {
  if (!state.wallet.wallet) {
    return;
  }

  const wallets = Object.keys(state.wallet.wallet).map(
    key => state.wallet.wallet?.[key],
  );

  return wallets.filter(
    (wallet, index) => !!wallet && wallets.indexOf(wallet) === index,
  );
};

export default slice;
