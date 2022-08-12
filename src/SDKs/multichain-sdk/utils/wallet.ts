import {Chain, THORChain} from '@xchainjs/xchain-util';
import {BigNumber} from 'bignumber.js';

import {ReactComponent as LedgerWalletIcon} from '../../../assets/crypto/wallets/ledger.svg';
import {ReactComponent as MetamaskIcon} from '../../../assets/crypto/wallets/metamask.svg';
import {ReactComponent as XdefiIcon} from '../../../assets/crypto/wallets/xdefi.svg';
import {ReactComponent as WalletNoConnected} from '../../../assets/icons/sidebar/WalletNoConnected.svg';

import {Wallet, SupportedChain, WalletOption} from '../clients/types';
import {Asset, AssetAmount, Pool, Amount} from '../entities';

export const getWalletAssets = (wallet: Wallet | null) => {
  const assets: Asset[] = [];

  if (!wallet) {
    return assets;
  }

  Object.keys(wallet).forEach(chain => {
    const chainWallet = wallet[chain as SupportedChain];
    chainWallet?.balance.forEach((data: AssetAmount) => {
      assets.push(data.asset);
    });
  });

  return assets;
};

export const getInputAssets = ({
  wallet,
  pools,
}: {
  wallet: Wallet | null;
  pools: Pool[];
}) => {
  const assets: Asset[] = [];

  const poolAssets = pools.map(pool => pool.asset);

  if (!wallet) {
    return poolAssets;
  }

  if (pools.length === 0) {
    return [];
  }

  Object.keys(wallet).forEach(chain => {
    const chainWallet = wallet[chain as SupportedChain];
    chainWallet?.balance.forEach((data: AssetAmount) => {
      // add all thorchain assets
      if (chain === THORChain) {
        assets.push(data.asset);
      } else if (poolAssets.find(poolAsset => poolAsset.eq(data.asset))) {
        // add pool assets from balance
        assets.push(data.asset);
      }
    });
  });

  return assets;
};

export const getInputAssetsForAdd = ({
  wallet,
  pools,
}: {
  wallet: Wallet | null;
  pools: Pool[];
}) => {
  const assets: Asset[] = [];

  const poolAssets = pools.map(pool => pool.asset);

  if (!wallet) {
    return poolAssets;
  }

  if (pools.length === 0) {
    return [];
  }

  Object.keys(wallet).forEach(chain => {
    const chainWallet = wallet[chain as SupportedChain];
    chainWallet?.balance.forEach((data: AssetAmount) => {
      if (poolAssets.find(poolAsset => poolAsset.eq(data.asset))) {
        assets.push(data.asset);
      }
    });
  });

  return assets;
};

export const getInputAssetsForCreate = ({
  wallet,
  pools,
}: {
  wallet: Wallet | null;
  pools: Pool[];
}) => {
  const assets: Asset[] = [];

  const poolAssets = pools.map(pool => pool.asset);

  if (!wallet) {
    return poolAssets;
  }

  if (pools.length === 0) {
    return [];
  }

  Object.keys(wallet).forEach(chain => {
    const chainWallet = wallet[chain as SupportedChain];
    chainWallet?.balance.forEach((data: AssetAmount) => {
      if (
        !poolAssets.find(poolAsset => poolAsset.eq(data.asset)) &&
        data.asset.ticker !== 'RUNE'
      ) {
        assets.push(data.asset);
      }
    });
  });

  return assets;
};

export const getNonPoolAssets = ({
  wallet,
  pools,
}: {
  wallet: Wallet | null;
  pools: Pool[];
}) => {
  const assets: Asset[] = [];

  const poolAssets = pools.map(pool => pool.asset);
  poolAssets.push(Asset.RUNE());

  if (!wallet) {
    return poolAssets;
  }

  if (pools.length === 0) {
    return [];
  }

  Object.keys(wallet).forEach(chain => {
    const chainWallet = wallet[chain as SupportedChain];
    chainWallet?.balance.forEach((data: AssetAmount) => {
      if (!poolAssets.find(poolAsset => poolAsset.eq(data.asset))) {
        assets.push(data.asset);
      }
    });
  });

  return assets;
};

export const removeAddressPrefix = (address: string): string => {
  const prefixIndex = address.indexOf(':') + 1;
  return address.substr(prefixIndex > 0 ? prefixIndex : 0);
};

export const getWalletAddressByChain = (
  wallet: Wallet,
  chain: Chain,
): string | null => {
  if (chain in wallet) {
    const addr = wallet?.[chain as SupportedChain]?.address ?? null;

    if (addr) {
      return removeAddressPrefix(addr);
    }
  }

  return null;
};

export const getAssetUSDPrice = (asset: Asset, pools: Pool[]): BigNumber => {
  const assetPool = pools.find(pool => pool.asset.eq(asset));

  if (!assetPool) {
    return new BigNumber(0);
  }

  return new BigNumber(assetPool.detail.assetPriceUSD);
};

export const getAssetBalance = (asset: Asset, wallet: Wallet): AssetAmount => {
  const emptyAmount = new AssetAmount(
    asset,
    Amount.fromBaseAmount(0, asset.decimal),
  );

  if (asset.L1Chain in wallet) {
    const chainWallet = wallet?.[asset.L1Chain as SupportedChain];

    return (
      chainWallet?.balance.find((assetData: AssetAmount) => {
        return assetData.asset.eq(asset);
      }) || emptyAmount
    );
  }

  return emptyAmount;
};

export const getRuneToUpgrade = (wallet: Wallet | null): Asset[] | null => {
  if (!wallet) {
    return null;
  }
  const runeToUpgrade: any[] = [];

  const bnbRuneBalance = wallet?.BNB?.balance?.find(
    (assetAmount: AssetAmount) => assetAmount.asset.ticker === 'RUNE',
  );
  const ethRuneBalance = wallet?.ETH?.balance?.find(
    (assetAmount: AssetAmount) => assetAmount.asset.ticker === 'RUNE',
  );

  if (bnbRuneBalance?.amount.baseAmount.gt(0)) {
    runeToUpgrade.push(bnbRuneBalance.asset);
  }

  if (ethRuneBalance?.amount.baseAmount.gt(0)) {
    runeToUpgrade.push(ethRuneBalance.asset);
  }

  return runeToUpgrade;
};

export const hasOldRuneInWallet = (wallet: Wallet): boolean => {
  const runeToUpgrade = getRuneToUpgrade(wallet);

  if (!runeToUpgrade) {
    return false;
  }

  return runeToUpgrade.length > 0;
};

export const getTotalUSDPriceInBalance = (
  balance: AssetAmount[],
  pools: Pool[],
): BigNumber => {
  let total = new BigNumber(0);

  if (!balance.length) {
    return total;
  }

  balance.forEach((assetBalance: AssetAmount) => {
    const usdPrice = getAssetUSDPrice(assetBalance.asset, pools);

    total = total.plus(assetBalance.amount.assetAmount.multipliedBy(usdPrice));
  });

  return total;
};

// check if any input asset needs tx signing via keystore
export const isKeystoreSignRequired = ({
  wallet,
  inputAssets,
}: {
  wallet: Wallet | null;
  inputAssets: Asset[];
}): boolean => {
  if (!wallet) {
    return false;
  }

  for (let i = 0; i < inputAssets.length; i++) {
    const asset = inputAssets[i];

    const chainWallet = wallet?.[asset.L1Chain as SupportedChain];

    if (chainWallet?.walletType === WalletOption.KEYSTORE) {
      return true;
    }
  }

  return false;
};

export const doesWalletSupportAsset = ({
  wallet,
  inputAsset,
}: {
  wallet: Wallet | null;
  inputAsset: Asset;
}): boolean => {
  if (!wallet) {
    return false;
  }

  const chainWallet = wallet?.[inputAsset.L1Chain as SupportedChain];

  if (!chainWallet) {
    return false;
  }

  return true;
};

export const hasConnectedWallet = (wallet: Wallet | null) => {
  if (!wallet) {
    return false;
  }

  let connected = false;

  Object.keys(wallet).forEach(chain => {
    if (wallet?.[chain as SupportedChain]?.walletType) {
      connected = true;
    }
  });

  return connected;
};

export const getWalletInfo = (
  isWalletLoading: boolean,
  wallet: Wallet | null,
) => {
  if (isWalletLoading) {
    return {walletName: 'Loading...', icon: WalletNoConnected};
  }

  const walletType = wallet?.BTC?.walletType;

  switch (walletType) {
    case WalletOption.LEDGER:
      return {walletName: 'Ledger', icon: LedgerWalletIcon};
    case WalletOption.METAMASK:
      return {walletName: 'MetaMask', icon: MetamaskIcon};
    case WalletOption.XDEFI:
      return {walletName: 'XDEFI', icon: XdefiIcon};
    case WalletOption.KEYSTORE:
      return {walletName: 'Keystore', icon: WalletNoConnected};
    case WalletOption.TRUSTWALLET:
      return {walletName: 'TrustWallet', icon: WalletNoConnected};
    default:
      return {walletName: 'Not connected', icon: WalletNoConnected};
  }
};
