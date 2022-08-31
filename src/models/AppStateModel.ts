import {FeeOption} from '@xchainjs/xchain-client';
import {Asset} from '../SDKs/multichain-sdk';

// import {NotificationProps} from 'components/Notifications/Notifications';

import {DataModel} from './DataModel';
import type {Asset as AssetType} from '../components/AssetsList';

export interface AppStateModel {
  data: DataModel[] | null;
  // notification: NotificationProps;
  baseCurrency: string;
  isSettingOpen: boolean;
  isFastSwapOpen: boolean;
  theme: 'light' | 'dark';
  slippageTolerance: number;
  feeOptionType: FeeOption;
  showAnnouncement: boolean;
  inputAsset: Asset;
  outputAsset: Asset;
  sendAsset: Asset;
  withdrawAsset: Asset;
  receiveAsset: Asset;
  assetsList: {
    state: string;
    data: AssetType[];
  };
}
