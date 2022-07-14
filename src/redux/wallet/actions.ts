import {createAsyncThunk} from '@reduxjs/toolkit';

import {multichain} from '../../services/multichain';

import {ChainAssets} from './types';

export const loadAllWallets = createAsyncThunk(
  'midgard/loadAllWallets',
  multichain.loadAllWallets,
);

export const getWalletByChain = createAsyncThunk(
  'midgard/getWalletByChain',
  async (chainAsset: ChainAssets) => {
    const {chain} = chainAsset;
    const data = await multichain.getWalletByChain(chain);
    return {
      chain,
      data,
    };
  },
);
