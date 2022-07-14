import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import {IConnector, IWalletConnectOptions} from '@walletconnect/types';

import {networkByChain, supportedNetworks, errorCodes} from './constants';
import {
  IAccount,
  IWalletConnectListeners,
  TWSupportedChain,
  WalletConnectOption,
} from './types';
import {removeCache} from './utils';

const qrcodeModalOptions = {
  mobileLinks: ['trust'],
};

export class WalletConnectClient {
  connector: IConnector | null;

  accounts: IAccount[] = [];

  private options: IWalletConnectOptions;

  private listeners: IWalletConnectListeners | undefined;

  constructor(walletconnectOptions?: WalletConnectOption) {
    this.connector = null;
    this.options = {
      qrcodeModalOptions,
      ...walletconnectOptions?.options,
    };
    this.listeners = walletconnectOptions?.listeners;
  }

  get connected() {
    if (this.connector) {
      return this.connector.connected;
    }
    return false;
  }

  connect = async (): Promise<IConnector> => {
    const options: IWalletConnectOptions = {
      // AUDIT:Minor Could we create constants instead? This would make a change easier to implement
      bridge: 'https://polygon.bridge.walletconnect.org',
      qrcodeModal: QRCodeModal,
      ...this.options,
    };

    removeCache();

    const connector = new WalletConnect(options);

    if (!connector.connected) {
      await connector.createSession();

      QRCodeModal.open(connector.uri, () => {}, qrcodeModalOptions);
    }

    this.connector = connector;

    await new Promise((resolve, reject) => {
      connector.on('connect', error => {
        if (error) {
          reject(error);
        }

        QRCodeModal.close();

        this.getAccounts().then(res => {
          resolve(res);
        });
      });

      connector.on('disconnect', (error: any) => {
        if (error) reject(error);

        if (this.listeners && this.listeners.disconnect) {
          this.listeners.disconnect();
        }

        this.connector = null;
      });
    });

    return connector;
  };

  killSession = async (): Promise<void> => {
    if (this.connector) {
      await this.connector.killSession();
    }

    this.connector = null;
  };

  getAccounts = async (): Promise<IAccount[]> => {
    if (!this.connector) {
      throw new Error(errorCodes.ERROR_SESSION_DISCONNECTED);
    }

    const accounts: IAccount[] = await this.connector.sendCustomRequest({
      jsonrpc: '2.0',
      method: 'get_accounts',
    });

    const supportedAccounts = accounts.filter(account =>
      supportedNetworks.includes(account.network),
    );

    this.accounts = supportedAccounts;

    return supportedAccounts;
  };

  getAddressByChain = (chain: TWSupportedChain): string => {
    const selectedAccount = this.accounts.find(
      item => item.network === networkByChain[chain],
    );

    if (!selectedAccount) {
      throw new Error(errorCodes.ERROR_CHAIN_NOT_SUPPORTED);
    }

    return selectedAccount.address;
  };

  signCustomTransaction = async ({
    network,
    tx,
  }: {
    network: number;
    tx: any;
  }): Promise<any> => {
    if (!this.connector) {
      throw new Error(errorCodes.ERROR_SESSION_DISCONNECTED);
    }

    return this.connector.sendCustomRequest({
      jsonrpc: '2.0',
      method: 'trust_signTransaction',
      params: [
        {
          network,
          transaction: JSON.stringify(tx),
        },
      ],
    });
  };

  transferERC20 = (txParams: any) => {
    if (!this.connector) {
      throw new Error(errorCodes.ERROR_SESSION_DISCONNECTED);
    }

    return this.connector.sendTransaction(txParams);
  };

  signTransactionERC20 = (txParams: any) => {
    if (!this.connector) {
      throw new Error(errorCodes.ERROR_SESSION_DISCONNECTED);
    }

    return this.connector.signTransaction(txParams);
  };
}
