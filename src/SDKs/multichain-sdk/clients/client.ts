import {TxHash} from '@thorwallet/xchain-client';
import {Chain} from '@thorwallet/xchain-util';

import {Asset, AssetAmount} from '../entities';
import {TxParams} from './types';

export interface IClient {
  chain: Chain;
  balance: AssetAmount[];

  loadBalance(): Promise<AssetAmount[]>;
  hasAmountInBalance(assetAmount: AssetAmount): Promise<boolean>;
  getAssetBalance(asset: Asset): Promise<AssetAmount>;

  transfer(tx: TxParams): Promise<TxHash>;
}
