import {hexlify} from '@ethersproject/bytes';
import {Network} from '@thorwallet/xchain-client';

import {WalletStatus} from './types';

export interface IMetaMaskClient {
  network: Network;

  isWalletDetected(): WalletStatus;
  getAddress(): Promise<string>;

  loadProvider(): void;
  getChainClient(): any;

  transferERC20(txParams: any): Promise<string>;
  signTransactionERC20(txParams: any): Promise<string>;
}

export class MetaMaskClient implements IMetaMaskClient {
  network: Network = Network.Testnet;

  private provider: any;

  constructor(network: Network) {
    this.network = network;

    if (typeof window === 'object') {
      this.provider = window.ethereum;
    }
  }

  isWalletDetected = (): WalletStatus => {
    if (typeof window === 'object') {
      if (window.ethereum) {
        return WalletStatus.MetaMaskDetected;
      }
    }

    return WalletStatus.NoWeb3Provider;
  };

  // load metamask provider for chain
  loadProvider = () => {
    this.provider = window.ethereum;
  };

  /**
   * get metamask eth client for chain
   * @returns get chain client
   */
  getChainClient = () => {
    this.loadProvider();

    return this.provider;
  };

  /**
   * get wallet address for chain
   * @returns wallet address
   */
  getAddress = async (): Promise<string> => {
    if (!this.provider) {
      throw Error('ethereum provider does not exist');
    }

    const accounts: string = await this.provider.request({
      method: 'eth_requestAccounts',
      params: [],
    });

    if (!accounts?.[0]) {
      throw Error('wallet not found');
    }

    return accounts[0];
  };

  /**
   * request transfer erc20
   * @param txParams metamask request param
   * @returns txhash string
   */
  transferERC20 = (txParams: any) => {
    const erc20TxParam = {
      ...txParams,
      gasPrice: hexlify(txParams?.gasPrice || 0),
      gasLimit: hexlify(txParams?.gasLimit || 0),
    };

    return this.provider.request({
      method: 'eth_sendTransaction',
      params: [erc20TxParam],
    });
  };

  /**
   * request sign erc20
   * @param txParams metamask request param
   * @returns txhash string
   */
  signTransactionERC20 = (txParams: any) => {
    const erc20TxParam = {
      ...txParams,
      gasPrice: hexlify(txParams?.gasPrice || 0),
      gasLimit: hexlify(txParams?.gasLimit || 0),
    };

    return this.provider.request({
      method: 'eth_signTransaction',
      params: [erc20TxParam],
    });
  };
}
