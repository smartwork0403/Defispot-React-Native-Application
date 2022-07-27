import {Keystore} from '@thorwallet/xchain-crypto';
import {Asset as AssetData} from '../../common/models/Asset';
import {Asset, Wallet, SupportedChain} from '../../SDKs/multichain-sdk';

export interface State {
  keystore: Keystore | null;
  wallet: Wallet | null;
  walletLoading: boolean;
  chainWalletLoading: {[key in SupportedChain]: boolean};
  isConnectWalletModalOpen: boolean;
  thorchainData: AssetData[];
  totalThorchainData: AssetData;
  thorchainLoading: boolean;
}
export interface ChainAssets {
  chain: SupportedChain;
  assets?: Asset[];
  contracts?: string[];
}
