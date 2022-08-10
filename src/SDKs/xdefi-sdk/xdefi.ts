/* eslint-disable @typescript-eslint/no-explicit-any */
import {hexlify} from '@ethersproject/bytes';
import {Network} from '@thorwallet/xchain-client';
import {DOGEChain} from '@thorwallet/xchain-util';

import {
  Provider,
  providersList,
  BTCChain,
  BNBChain,
  THORChain,
  ETHChain,
  LTCChain,
  BCHChain,
  THORCHAIN_POOL_ADDRESS,
} from './constants';
import {
  SupportedChain,
  supportedChains,
  TxParams,
  XdefiTxParams,
} from './types';
import {assetFromString} from './utils';

declare global {
  interface Window {
    xfi: any;
    ethereum: any;
  }
}

export interface IXdefiClient {
  network: Network;
  supportedChains: typeof supportedChains;
  providers: Provider[];

  isWalletDetected(): boolean;
  getAddress(chain: SupportedChain): Promise<string>;
  setAccountChangeListener(listener: () => void): void;

  reloadProviders(): void;
  loadProvider(chain: SupportedChain): void;
  getChainClient(chain: SupportedChain): any;

  transfer(txParams: TxParams): Promise<string>;
  vaultTransfer(txParams: TxParams): Promise<string>;

  depositTHOR(txParams: TxParams): Promise<string>;
  transferERC20(txParams: any): Promise<string>;
  signTransactionERC20(txParams: any): Promise<string>;
}

export class XdefiClient implements IXdefiClient {
  network: Network = Network.Testnet;

  providers = providersList;

  supportedChains = supportedChains;

  private xdefi: any;

  private eth: any;

  private btc: any;

  private bnb: any;

  private bch: any;

  private ltc: any;

  private thor: any;

  private doge: any;

  constructor(network: Network) {
    this.network = network;

    if (typeof window === 'object') {
      this.xdefi = window.xfi;
      if (window?.xfi) {
        this.eth = window.xfi.ethereum;
        this.btc = window.xfi.bitcoin;
        this.bnb = window.xfi.binance;
        this.bch = window.xfi.bitcoincash;
        this.ltc = window.xfi.litecoin;
        this.thor = window.xfi.thorchain;
        // this.doge = window.xfi.dogecoin;
      }
    }
  }

  isWalletDetected = (): boolean => {
    if (typeof window === 'object') {
      return !!window.xfi;
    }

    return false;
  };

  // reload all providers
  reloadProviders = () => {
    if (typeof window === 'object') {
      this.xdefi = window.xfi;
      if (window?.xfi) {
        this.eth = window.xfi.ethereum;
        this.btc = window.xfi.bitcoin;
        this.bnb = window.xfi.binance;
        this.bch = window.xfi.bitcoincash;
        this.ltc = window.xfi.litecoin;
        // this.doge = window.xfi.dogecoin;
        this.thor = window.xfi.thorchain;
      }
    }
  };

  // load xdefi provider for chain
  loadProvider = (chain: SupportedChain) => {
    if (typeof window === 'object' && window?.xfi) {
      if (chain === BTCChain) this.btc = window.xfi.bitcoin;
      if (chain === BNBChain) this.bnb = window.xfi.binance;
      if (chain === ETHChain) this.eth = window.xfi.ethereum;
      if (chain === BCHChain) this.bch = window.xfi.bitcoincash;
      if (chain === LTCChain) this.ltc = window.xfi.litecoin;
      // if (chain === DOGEChain) this.doge = window.xfi.dogecoin;

      this.thor = window.xfi.thorchain;
    }
  };

  // set listener for account change event
  setAccountChangeListener = (listener: () => void): void => {
    if (typeof window === 'object' && window?.xfi) {
      window.xfi.ethereum.on('accountsChanged', () => {
        listener();
      });
    }
  };

  /**
   * get xdefi client for chain
   * @param chain supported chain network
   * @returns get chain client
   */
  getChainClient = (chain: SupportedChain) => {
    this.loadProvider(chain);

    if (chain === BTCChain) return this.btc;
    if (chain === BNBChain) return this.bnb;
    if (chain === ETHChain) return this.eth;
    if (chain === BCHChain) return this.bch;
    if (chain === LTCChain) return this.ltc;
    if (chain === DOGEChain) return this.doge;
    return this.thor;
  };

  /**
   * get wallet address for chain
   * @param chain supported chain network
   * @returns wallet address
   */
  getAddress = async (chain: SupportedChain): Promise<string> => {
    if (chain === ETHChain) {
      if (!this.eth) throw Error('ethereum provider does not exist');

      const accounts: string = await this.eth.request({
        method: 'eth_requestAccounts',
        params: [],
      });

      if (!accounts?.[0]) throw Error(`${chain} wallet not found`);

      return accounts[0];
    }

    const chainClient = this.getChainClient(chain);

    if (!chainClient) throw Error(`${chain} provider does not exist`);

    const account: string = await new Promise((resolve, reject) => {
      chainClient.request(
        {
          method: 'request_accounts',
          params: [],
        },
        (err: any, accounts: string[]) => {
          if (err) {
            return reject(err);
          }

          return resolve(accounts[0]);
        },
      );
    });

    return account;
  };

  /**
   * normal transfer
   * @param chain supported chain
   * @returns tx hash
   */
  transfer = async (txParams: TxParams): Promise<string> => {
    const {asset, amount, decimal, recipient, memo} = txParams;
    const assetObj = assetFromString(asset);

    if (!assetObj) throw Error('invalid asset');
    const {chain} = assetObj;

    const chainClient = this.getChainClient(chain as SupportedChain);
    const address = await this.getAddress(chain as SupportedChain);

    const params: XdefiTxParams[] = [
      {
        asset: assetObj,
        from: address,
        amount: {
          amount,
          decimals: decimal,
        },
        recipient,
        memo,
      },
    ];

    const txHash: string = await new Promise((resolve, reject) => {
      chainClient.request(
        {
          method: 'transfer',
          params,
        },
        (err: any, txhash: string) => {
          if (err) {
            return reject(err);
          }

          return resolve(txhash);
        },
      );
    });

    return txHash;
  };

  /**
   * vault transfer (normal send for btc, bnb, ltc, tch. deposit for eth, thor)
   * @param chain supported chain
   * @returns tx hash
   */
  vaultTransfer = async (txParams: TxParams): Promise<string> => {
    const {asset, amount, decimal, recipient, memo} = txParams;
    const assetObj = assetFromString(asset);

    if (!assetObj) throw Error('invalid asset');
    const {chain} = assetObj;

    /**
     * 1. get wallet client for chain
     * 2. get wallet address
     * 3. compose tx param
     * 4. request vault transfer
     */

    if (chain === THORChain) {
      return this.depositTHOR(txParams);
    }

    const chainClient = this.getChainClient(chain as SupportedChain);
    const address = await this.getAddress(chain as SupportedChain);

    const params: XdefiTxParams[] = [
      {
        from: address,
        asset: assetObj,
        amount: {
          amount,
          decimals: decimal,
        },
        recipient,
        memo,
      },
    ];

    const txHash: string = await new Promise((resolve, reject) => {
      chainClient.request(
        {
          method: 'transfer',
          params,
        },
        (err: any, txhash: string) => {
          if (err) {
            return reject(err);
          }

          return resolve(txhash);
        },
      );
    });

    return txHash;
  };

  /**
   * request thorchain deposit
   * @param params xdefi request params
   * @returns txhash string
   */
  depositTHOR = async (txParams: TxParams): Promise<string> => {
    if (!this.thor) throw Error('THORChain Provider not found');

    const {asset, amount, decimal, memo} = txParams;

    const assetObj = assetFromString(asset);

    if (!assetObj) throw Error('invalid asset');

    const address = await this.getAddress(THORChain);

    const params: XdefiTxParams[] = [
      {
        from: address,
        asset: assetObj,
        amount: {
          amount,
          decimals: decimal,
        },
        recipient: THORCHAIN_POOL_ADDRESS,
        memo,
      },
    ];

    const txHash: string = await new Promise((resolve, reject) => {
      this.thor.request(
        {
          method: 'deposit',
          params,
        },
        (err: any, txhash: string) => {
          if (err) {
            return reject(err);
          }

          return resolve(txhash);
        },
      );
    });

    return txHash;
  };

  /**
   * request transfer erc20
   * @param txParams xdefi request param
   * @returns txhash string
   */
  transferERC20 = (txParams: any) => {
    const erc20TxParam = {
      ...txParams,
      gasPrice: hexlify(txParams?.gasPrice || 0),
      gasLimit: hexlify(txParams?.gasLimit || 0),
    };

    return this.eth.request({
      method: 'eth_sendTransaction',
      params: [erc20TxParam],
    });
  };

  /**
   * request sign erc20
   * @param txParams xdefi request param
   * @returns txhash string
   */
  signTransactionERC20 = (txParams: any) => {
    const erc20TxParam = {
      ...txParams,
      gasPrice: hexlify(txParams?.gasPrice || 0),
      gasLimit: hexlify(txParams?.gasLimit || 0),
    };

    return this.eth.request({
      method: 'eth_signTransaction',
      params: [erc20TxParam],
    });
  };
}
