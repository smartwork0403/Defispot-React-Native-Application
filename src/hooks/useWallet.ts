import {useCallback, useMemo} from 'react';

import {Keystore} from '@thorwallet/xchain-crypto';
import {ETHChain} from '@thorwallet/xchain-util';
import {hasConnectedWallet, SupportedChain} from '../SDKs/multichain-sdk';

import {useAppDispatch, useAppSelector} from '../redux/hooks';
import * as walletActions from '../redux/wallet/actions';
import {actions, selectState as selectWalletState} from '../redux/wallet/slice';

import {multichain} from '../services/multichain';

export const useWallet = () => {
  const dispatch = useAppDispatch();
  const walletState = useAppSelector(selectWalletState);
  const {wallet, walletLoading, chainWalletLoading} = walletState;
  const walletLoadingByChain = Object.keys(chainWalletLoading).map(
    chain => chainWalletLoading[chain as SupportedChain],
  );

  const isConnected = useMemo(() => hasConnectedWallet(wallet), [wallet]);

  const isWalletLoading = walletLoadingByChain.reduce(
    (status, next) => status || next,
    walletLoading,
  );

  const unlockWallet = useCallback(
    async (keystore: Keystore, phrase: string) => {
      await multichain.connectKeystore(phrase);
      dispatch(actions.connectKeystore(keystore));
      //@ts-ignore
      dispatch(walletActions.loadAllWallets());
    },
    [dispatch],
  );

  const disconnectWallet = useCallback(() => {
    multichain.resetClients().finally(() => dispatch(actions.disconnect()));
  }, [dispatch]);

  const connectXdefiWallet = useCallback(async () => {
    await multichain.resetClients();
    await multichain.connectXDefiWallet();
    //@ts-ignore
    dispatch(walletActions.loadAllWallets());
  }, [dispatch]);

  const connectMetamask = useCallback(async () => {
    await multichain.connectMetamask();
    //@ts-ignore
    dispatch(walletActions.getWalletByChain({chain: ETHChain}));
  }, [dispatch]);

  const setIsConnectWalletModalOpen = useCallback(
    (visible: boolean) => {
      dispatch(actions.setIsConnectWalletModalOpen(visible));
    },
    [dispatch],
  );

  return {
    ...walletState,
    ...walletActions,
    isWalletLoading,
    isConnected,
    unlockWallet,
    setIsConnectWalletModalOpen,
    disconnectWallet,
    connectXdefiWallet,
    connectMetamask,
  };
};
