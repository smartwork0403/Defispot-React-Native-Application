/* eslint-disable @typescript-eslint/return-await */
import {
  TxHash,
  Network,
  Fees,
  TxsPage,
  TxHistoryParams,
  Tx,
  FeeOption,
} from '@xchainjs/xchain-client';
import {decryptFromKeystore, Keystore} from '@xchainjs/xchain-crypto';
import {Client as EthClient, getTokenAddress} from '@xchainjs/xchain-ethereum';
import {getChainIds, getDefaultClientUrl} from '@xchainjs/xchain-thorchain';
import {
  baseAmount,
  Chain,
  BTCChain,
  BNBChain,
  THORChain,
  ETHChain,
  LTCChain,
  BCHChain,
  DOGEChain,
  CosmosChain,
} from '@xchainjs/xchain-util';
import {MetaMaskClient, WalletStatus} from 'metamask-sdk';
import {MidgardV2, InboundAddressesItem} from 'midgard-sdk';
import {
  WalletConnectClient,
  WalletConnectOption,
} from 'wallet-core/walletconnect';

import {AssetInfo} from 'redux/server/types';

import {XdefiClient} from '../../xdefi-sdk/xdefi';
import {Swap, Memo, Asset, AssetAmount} from '../entities';
import {getFeeRate} from '../utils/fee';
import {removeAddressPrefix} from '../utils/wallet';
import {BnbChain} from './binance';
import {BtcChain} from './bitcoin';
import {BchChain} from './bitcoinCash';
import {GaiaChain} from './cosmos';
import {DogeChain} from './doge';
import {EthChain} from './ethereum';
import {LtcChain} from './litecoin';
import {ThorChain} from './thorchain';
import {getInboundDataByChain, getInboundDataArray} from './thornode';
import {
  TxParams,
  AddLiquidityParams,
  CreateLiquidityParams,
  WithdrawParams,
  Wallet,
  ChainWallet,
  SUPPORTED_CHAINS,
  LEDGER_SUPPORTED_CHAINS,
  SupportedChain,
  AddLiquidityTxns,
  UpgradeParams,
  WalletOption,
} from './types';

// AUDIT:Minor Could we refactor this file so it becomes smaller and easy to read? We could separate the interfaces and types into different files

type NonETHChainClient =
  | BnbChain
  | BtcChain
  | LtcChain
  | ThorChain
  | DogeChain
  | GaiaChain;

const THORCHAIN_POOL_ADDRESS = '';

export interface IMultiChain {
  chains: typeof SUPPORTED_CHAINS;
  midgard: MidgardV2;
  network: string;
  wallets: Wallet | null;
  thor: ThorChain;
  btc: BtcChain;
  bnb: BnbChain;
  eth: EthChain;
  ltc: LtcChain;
  bch: BchChain;
  doge: DogeChain;
  cosmos: GaiaChain;
  feeOption: FeeOption;

  resetClients(): void;

  getPhrase(): string;
  connectKeystore(phrase: string): void;
  validateKeystore(keystore: Keystore, password: string): Promise<boolean>;

  connectMetamask(): Promise<void>;
  connectTrustWallet(options?: WalletConnectOption): Promise<void>;
  connectXDefiWallet(): Promise<void>;
  connectAllClientsToXDefi(): Promise<void>;

  getMidgard(): MidgardV2;

  getChainClient(chain: Chain): void;

  getInboundDataByChain(chain: Chain): Promise<InboundAddressesItem>;

  getWalletByChain(chain: Chain): Promise<ChainWallet | null>;
  loadAllWallets(): Promise<Wallet | null>;
  getWalletAddressByChain(chain: Chain): string | null;

  validateAddress({address, chain}: {address: string; chain: Chain}): boolean;

  getExplorerUrl(chain: Chain): string;
  getExplorerAddressUrl(chain: Chain, address: string): string;
  getExplorerTxUrl(chain: Chain, txHash: string): string;

  getTransactions(chain: Chain, params?: TxHistoryParams): Promise<TxsPage>;
  getTransactionData(chain: Chain, txHash: string): Promise<Tx>;

  setFeeOption(option: FeeOption): void;
  getFees(chain: Chain): Promise<Fees>;

  isAssetApproved(asset: Asset): Promise<boolean>;
  approveAsset(asset: Asset): Promise<TxHash | null>;

  send(tx: TxParams): Promise<TxHash>;
  transfer(tx: TxParams, native?: boolean): Promise<TxHash>;
  swap(swap: Swap, recipient?: string): Promise<TxHash>;
  addLiquidity(params: AddLiquidityParams): Promise<AddLiquidityTxns>;
  withdraw(params: WithdrawParams): Promise<TxHash>;
  upgrade(params: UpgradeParams): Promise<TxHash>;
}

export class MultiChain implements IMultiChain {
  private phrase: string;

  private xdefiClient: XdefiClient | null = null;

  private metamaskClient: MetaMaskClient | null = null;

  private trustwalletClient: WalletConnectClient | null = null;

  private wallet: Wallet | null = null;

  public readonly chains = SUPPORTED_CHAINS;

  public readonly midgard: MidgardV2;

  public readonly network: Network;

  public thor: ThorChain;

  public btc: BtcChain;

  public bnb: BnbChain;

  public eth: EthChain;

  public bch: BchChain;

  public ltc: LtcChain;

  public doge: DogeChain;

  public cosmos: GaiaChain;

  public feeOption: FeeOption = FeeOption.Fast;

  public lunaTokens: AssetInfo[] = [];

  constructor({
    network = Network.Testnet,
    phrase = '',
  }: {
    network?: Network;
    phrase?: string;
  }) {
    this.network = network;
    this.phrase = phrase;

    this.midgard = new MidgardV2(network);

    this.thor = new ThorChain({network});
    this.bnb = new BnbChain({network});
    this.btc = new BtcChain({network});
    this.eth = new EthChain({network});
    this.ltc = new LtcChain({network});
    this.bch = new BchChain({network});
    this.doge = new DogeChain({network});
    this.cosmos = new GaiaChain({network});
  }

  connectLedger = async ({
    chain,
    addressIndex = 0,
  }: {
    chain: Chain;
    addressIndex?: number;
  }) => {
    if (!(chain in LEDGER_SUPPORTED_CHAINS)) {
      let ledgerAddress = '';

      if (chain === BNBChain) {
        await this.bnb.connectLedger(addressIndex);
        ledgerAddress = this.bnb.getClient().getAddress().toLowerCase();
      }
      if (chain === THORChain) {
        await this.thor.connectLedger(addressIndex);
        ledgerAddress = this.thor.getClient().getAddress().toLowerCase();
      }

      if (!ledgerAddress) throw Error('Ledger not connected');

      if (!this.wallet) this.initWallets();

      if (this.wallet) {
        this.wallet = {
          ...this.wallet,
          [chain]: {
            address: ledgerAddress,
            balance: [],
            walletType: WalletOption.LEDGER,
          },
        };
      }
    } else {
      throw Error(`Ledger connect is not supprted for ${chain} chain`);
    }
  };

  connectMetamask = async (): Promise<void> => {
    this.metamaskClient = new MetaMaskClient(this.network);

    if (
      this.metamaskClient.isWalletDetected() !== WalletStatus.MetaMaskDetected
    ) {
      throw Error('metamask wallet not detected');
    }

    await this.eth.connectMetaMask(this.metamaskClient);
    const metamaskAddress = this.eth.getClient().getAddress().toLowerCase();

    if (!this.wallet) this.initWallets();

    if (this.wallet) {
      this.wallet = {
        ...this.wallet,
        [ETHChain]: {
          address: metamaskAddress,
          balance: [],
          walletType: WalletOption.METAMASK,
        },
      };
    }
  };

  connectTrustWallet = async (options?: WalletConnectOption) => {
    this.trustwalletClient = new WalletConnectClient(options);

    if (!this.trustwalletClient.connected) {
      await this.trustwalletClient.connect();
    }

    if (!this.wallet) this.initWallets();

    await this.bnb.connectTrustWallet(this.trustwalletClient);
    await this.eth.connectTrustWallet(this.trustwalletClient);
    await this.thor.connectTrustWallet(this.trustwalletClient);

    const bnbAddress = this.bnb.getClient().getAddress().toLowerCase();
    const ethAddress = this.eth.getClient().getAddress().toLowerCase();
    const thorAddress = this.thor.getClient().getAddress().toLowerCase();

    if (!this.wallet) this.initWallets();

    if (this.wallet) {
      this.wallet = {
        ...this.wallet,
        [BNBChain]: {
          address: bnbAddress,
          balance: [],
          walletType: WalletOption.TRUSTWALLET,
        },
        [ETHChain]: {
          address: ethAddress,
          balance: [],
          walletType: WalletOption.TRUSTWALLET,
        },
        [THORChain]: {
          address: thorAddress,
          balance: [],
          walletType: WalletOption.TRUSTWALLET,
        },
      };
    }
  };

  connectXDefiWallet = async (): Promise<void> => {
    this.xdefiClient = new XdefiClient(this.network);

    if (!this.xdefiClient.isWalletDetected()) {
      throw Error('xdefi wallet not detected');
    }

    await this.connectAllClientsToXDefi();

    this.resetWallets();
  };

  // patch client methods to use xdefi request and address
  connectAllClientsToXDefi = async () => {
    if (!this.xdefiClient) throw Error('xdefi client not found');
    await this.thor.connectXdefiWallet(this.xdefiClient);
    await this.btc.connectXdefiWallet(this.xdefiClient);
    await this.bch.connectXdefiWallet(this.xdefiClient);
    await this.ltc.connectXdefiWallet(this.xdefiClient);
    await this.bnb.connectXdefiWallet(this.xdefiClient);
    await this.eth.connectXdefiWallet(this.xdefiClient);
    await this.doge.connectXdefiWallet(this.xdefiClient);
  };

  initWallets = () => {
    this.wallet = {
      [BTCChain]: null,
      [BNBChain]: null,
      [BCHChain]: null,
      [LTCChain]: null,
      [ETHChain]: null,
      [THORChain]: null,
      [DOGEChain]: null,
      [CosmosChain]: null,
    };
  };

  // reload wallet address and reset balance
  resetWallets = () => {
    this.initWallets();

    this.chains.forEach((chain: SupportedChain) => {
      const chainClient = this.getChainClient(chain);

      if (chainClient) {
        const {walletType} = chainClient;
        if (walletType && this.wallet) {
          const address = removeAddressPrefix(
            chain !== Chain.Doge
              ? chainClient.getClient().getAddress().toLowerCase()
              : chainClient.getClient().getAddress(),
          );

          this.wallet[chain] = {
            address,
            balance: [],
            walletType,
          };
        }
      }
    });
  };

  resetClients = async () => {
    this.phrase = '';
    this.wallet = null;

    // kill TrustWallet session if TW client is valid
    if (this.trustwalletClient) {
      this.trustwalletClient.killSession();
    }
    const chainIds = await getChainIds(getDefaultClientUrl());
    // reset all clients
    this.thor = new ThorChain({network: this.network, chainIds});
    this.bnb = new BnbChain({network: this.network});
    this.btc = new BtcChain({network: this.network});
    this.eth = new EthChain({network: this.network});
    this.ltc = new LtcChain({network: this.network});
    this.bch = new BchChain({network: this.network});
    this.doge = new DogeChain({network: this.network});
    this.cosmos = new GaiaChain({network: this.network});
  };

  connectKeystore = async (phrase: string) => {
    this.phrase = phrase;

    this.bnb.connectKeystore(phrase);
    this.btc.connectKeystore(phrase);
    this.ltc.connectKeystore(phrase);
    this.bch.connectKeystore(phrase);
    await this.thor.connectKeystore(phrase);
    this.eth.connectKeystore(phrase);
    this.doge.connectKeystore(phrase);
    this.cosmos.connectKeystore(phrase);
    this.resetWallets();
  };

  getPhrase = () => {
    return this.phrase;
  };

  // used to validate keystore and password with phrase
  validateKeystore = async (keystore: Keystore, password: string) => {
    const phrase = await decryptFromKeystore(keystore, password);

    return phrase === this.phrase;
  };

  get wallets(): Wallet | null {
    return this.wallet;
  }

  /**
   * get midgard client
   */
  getMidgard(): MidgardV2 {
    return this.midgard;
  }

  getInboundDataByChain = async (
    chain: Chain,
  ): Promise<InboundAddressesItem> => {
    try {
      // for thorchain, return empty string
      if (chain === THORChain) {
        return {
          address: THORCHAIN_POOL_ADDRESS,
          halted: false,
          chain: 'THORChain',
          pub_key: '',
        };
      }

      const inboundData = await getInboundDataByChain(chain, this.network);

      return inboundData;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getChainClient = (chain: Chain) => {
    if (chain === THORChain) return this.thor;
    if (chain === BNBChain) return this.bnb;
    if (chain === BTCChain) return this.btc;
    if (chain === ETHChain) return this.eth;
    if (chain === LTCChain) return this.ltc;
    if (chain === BCHChain) return this.bch;
    if (chain === DOGEChain) return this.doge;
    if (chain === CosmosChain) return this.cosmos;
    return null;
  };

  getWalletByChain = async (chain: Chain): Promise<ChainWallet | null> => {
    const chainClient = this.getChainClient(chain);

    if (!chainClient) throw new Error('invalid chain');

    try {
      const {walletType} = chainClient;

      if (!walletType) return null;
      const balance = (await chainClient?.loadBalance()) ?? [];
      // filter doge because addresses are case-sensitive
      const address = removeAddressPrefix(
        chain !== DOGEChain
          ? chainClient.getClient().getAddress().toLowerCase()
          : chainClient.getClient().getAddress(),
      );

      if (this.wallet && chain in this.wallet) {
        this.wallet = {
          ...this.wallet,
          [chain]: {
            address,
            balance,
            walletType,
          },
        };
      }

      return {
        address,
        balance,
        walletType,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  };

  loadAllWallets = async (): Promise<Wallet | null> => {
    try {
      await Promise.all(
        this.chains.map((chain: SupportedChain) => {
          return new Promise(resolve => {
            this.getWalletByChain(chain)
              .then(data => resolve(data))
              .catch(() => {
                resolve([]);
              });
          });
        }),
      );

      return this.wallet;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getWalletAddressByChain = (chain: Chain): string | null => {
    if (this.wallet && chain in this.wallet) {
      const addr = this.wallet?.[chain as SupportedChain]?.address ?? null;

      if (addr) {
        return removeAddressPrefix(addr);
      }
    }

    return null;
  };

  validateAddress = ({
    address,
    chain,
  }: {
    address: string;
    chain: Chain;
  }): boolean => {
    const chainClient = this.getChainClient(chain);
    if (!chainClient) return false;

    return chainClient.getClient().validateAddress(address);
  };

  getExplorerUrl = (chain: Chain): string => {
    const chainClient = this.getChainClient(chain);
    if (!chainClient) return '#';

    return chainClient.getClient().getExplorerUrl();
  };

  // AUDIT:Minor Could we create constants instead of static urls? It would make a change easier in a future
  getExplorerAddressUrl = (chain: Chain, address: string): string => {
    if (chain === THORChain) {
      if (this.network === Network.Mainnet) {
        return `https://viewblock.io/thorchain/address/${address}`;
      }
      if (this.network === Network.Stagenet) {
        return `https://viewblock.io/thorchain/address/${address}?network=stagenet`;
      }
      return `https://viewblock.io/thorchain/address/${address}?network=testnet`;
    }

    const chainClient = this.getChainClient(chain);
    if (!chainClient) return '#';

    return chainClient.getClient().getExplorerAddressUrl(address);
  };

  getExplorerTxUrl = (chain: Chain, txHash: string): string => {
    const chainClient = this.getChainClient(chain);

    if (!chainClient) return '#';

    // add 0x suffix for eth chain
    if (chain === ETHChain) {
      if (txHash.substr(0, 2).toLowerCase() !== '0x') {
        return chainClient.getClient().getExplorerTxUrl(`0x${txHash}`);
      }
    }

    // AUDIT:Minor Could we create constants instead of static urls? It would make a change easier in a future
    // return viewblock for thorchain txns
    if (chain === THORChain) {
      if (this.network === Network.Mainnet) {
        return `https://viewblock.io/thorchain/tx/${txHash}`;
      }
      if (this.network === Network.Stagenet) {
        return `https://viewblock.io/thorchain/tx/${txHash}?network=stagenet`;
      }
      return `https://viewblock.io/thorchain/tx/${txHash}?network=testnet`;
    }

    return chainClient.getClient().getExplorerTxUrl(txHash);
  };

  getTransactions = (
    chain: Chain,
    params?: TxHistoryParams,
  ): Promise<TxsPage> => {
    const chainClient = this.getChainClient(chain);
    if (!chainClient || !params) throw new Error('invalid chain');

    return chainClient.getClient().getTransactions(params);
  };

  getTransactionData = (chain: Chain, txHash: string): Promise<Tx> => {
    const chainClient = this.getChainClient(chain);
    if (!chainClient) throw new Error('invalid chain');

    const address = chainClient.getClient().getAddress();

    return chainClient.getClient().getTransactionData(txHash, address);
  };

  setFeeOption = (option: FeeOption) => {
    this.feeOption = option;
  };

  getFees = (chain: Chain, tx?: TxParams): Promise<Fees> => {
    const chainClient = this.getChainClient(chain);
    if (!chainClient) throw new Error('invalid chain');

    if (chain === 'ETH' && tx) {
      const {assetAmount, recipient} = tx;
      const {asset} = assetAmount;
      const amount = baseAmount(assetAmount.amount.baseAmount, asset.decimal);

      const assetObj = {
        chain: asset.chain,
        symbol: asset.symbol,
        ticker: asset.ticker,
        synth: false,
      };
      const ethClient: EthClient =
        chainClient.getClient() as unknown as EthClient;
      return ethClient.getFees({
        asset: assetObj,
        amount,
        recipient,
      });
    }

    return (chainClient as NonETHChainClient).getClient().getFees();
  };

  isAssetApproved = async (asset: Asset): Promise<boolean> => {
    // non-erc20, eth, synth assets
    if (asset.chain !== ETHChain || asset.isETH() || asset.synth) return true;

    const {router: spenderAddress} = await this.getInboundDataByChain(ETHChain);

    const contractAddress = getTokenAddress(asset.getAssetObj());

    if (spenderAddress && contractAddress) {
      const isApproved = await this.eth.isApproved({
        contractAddress,
        spenderAddress,
      });

      return isApproved;
    }

    return false;
  };

  approveAsset = async (asset: Asset): Promise<TxHash | null> => {
    if (asset.chain !== ETHChain || asset.isETH()) return null;

    const {router: spenderAddress} = await this.getInboundDataByChain(ETHChain);

    const contractAddress = getTokenAddress(asset.getAssetObj());
    if (spenderAddress && contractAddress) {
      return this.eth.approve({
        contractAddress,
        spenderAddress,
        feeOption: this.feeOption,
      });
    }

    return null;
  };

  /**
   * cross-chain transfer tx
   * @param {TxParams} tx transfer parameter
   */
  transfer = async (
    tx: TxParams & {router?: string},
    native = true,
  ): Promise<TxHash> => {
    const chain = tx.assetAmount.asset.L1Chain;

    // for swap, add, withdraw tx in thorchain, send deposit tx
    if (
      chain === THORChain &&
      tx.recipient === THORCHAIN_POOL_ADDRESS &&
      native
    ) {
      return this.thor.deposit(tx);
    }

    // call deposit contract for eth chain
    if (chain === ETHChain) {
      if (tx.router) {
        return this.eth.deposit({
          ...tx,
          router: tx.router,
        });
      }
      throw new Error('Invalid ETH Router');
    }

    const chainClient = this.getChainClient(chain);
    if (chainClient) {
      try {
        return await chainClient.transfer(tx);
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      throw new Error('Chain does not exist');
    }
  };

  /**
   * normal send tx
   * @param {TxParams} tx transfer parameter
   */
  send = async (tx: TxParams): Promise<TxHash> => {
    const chain = tx.assetAmount.asset.L1Chain;

    const inboundData = await this.getInboundDataByChain(chain);

    const feeRate = getFeeRate({inboundData, feeOptionKey: this.feeOption});

    const chainClient = this.getChainClient(chain);
    if (chainClient) {
      try {
        return await chainClient.transfer({...tx, feeRate});
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      throw new Error('Chain does not exist');
    }
  };

  /**
   * swap assets
   * @param {Swap} swap Swap Object
   */
  swap = async (
    swap: Swap,
    recipient?: string,
    affiliate?: string,
    chargeAffiliate?: boolean,
  ): Promise<TxHash> => {
    /**
     * 1. check if swap has sufficient fee
     * 2. get inbound address and check if trading is halted or not
     * 3. get swap memo
     * 4. transfer input asset to inbound address
     */

    try {
      if (!this.wallet) {
        return await Promise.reject(new Error('Wallet not detected'));
      }

      const walletAddress = this.getWalletAddressByChain(
        swap.outputAsset.L1Chain,
      );

      const recipientAddress = recipient || walletAddress;

      if (!recipientAddress) {
        return await Promise.reject(
          new Error('Recipient address is not valid'),
        );
      }

      if (swap.hasInSufficientFee) {
        return await Promise.reject(new Error('Insufficient Fee'));
      }

      const inboundDataArray = await getInboundDataArray(this.network);

      let inTradeInboundData: InboundAddressesItem | undefined;

      if (swap.inputAsset.chain === THORChain) {
        inTradeInboundData = {
          address: THORCHAIN_POOL_ADDRESS,
          halted: false,
          chain: 'THORChain',
          pub_key: '',
        };
      } else {
        inTradeInboundData = inboundDataArray.find(
          (item: InboundAddressesItem) => item.chain === swap.inputAsset.chain,
        );
      }
      const outTradeInboundData = inboundDataArray.find(
        (item: InboundAddressesItem) => item.chain === swap.outputAsset.chain,
      );

      if (!inTradeInboundData) {
        throw Error('GET Inbound address failed');
      }

      // check if trading is halted or not
      if (inTradeInboundData?.halted || outTradeInboundData?.halted) {
        throw Error(
          'Trading is temporarily halted now, please try again later.',
        );
      }

      const {address: poolAddress, router} = inTradeInboundData;
      const feeRate = getFeeRate({
        inboundData: inTradeInboundData,
        feeOptionKey: this.feeOption,
      });

      const memo = Memo.swapMemo(
        swap.outputAsset,
        recipientAddress,
        swap.minOutputAmount, // slip limit
        this.network,
        swap.inputAsset,
        affiliate,
        chargeAffiliate,
      );

      return await this.transfer({
        assetAmount: swap.inputAmount,
        recipient: poolAddress,
        memo,
        router,
        feeRate: feeRate ? Number(feeRate) : undefined,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * add liquidity to pool
   * @param {AddLiquidityParams} params
   */
  addLiquidity = async (
    params: AddLiquidityParams,
    type = 'auto',
    affiliate?: string,
  ): Promise<AddLiquidityTxns> => {
    /**
     * 1. get inbound data and check if trading is halted
     * 2. get add liquidity memo
     * 3. check add type (Sym or Asym add)
     * 4. add liquidity to pool
     */

    try {
      const {pool, runeAmount, assetAmount} = params;
      const {chain} = pool.asset;

      const inboundData = await this.getInboundDataByChain(chain);
      const {address: poolAddress, router} = inboundData;

      // check if trading is halted or not
      if (inboundData.halted) {
        throw Error(
          'Trading is temporarily halted now, please try again later.',
        );
      }

      const feeRate = getFeeRate({inboundData, feeOptionKey: this.feeOption});

      const assetAddress = this.getWalletAddressByChain(chain) || '';
      const thorAddress = this.getWalletAddressByChain(THORChain) || '';

      // used for sym deposit recovery
      if (type === 'sym_rune') {
        if (runeAmount?.gt(0)) {
          const runeTx = await this.transfer({
            assetAmount: runeAmount,
            recipient: THORCHAIN_POOL_ADDRESS,
            memo: Memo.depositMemo(pool.asset, assetAddress, affiliate),
            feeRate,
          });

          return {
            runeTx,
          };
        }
        throw Error('invalid rune amount');
      } else if (type === 'sym_asset') {
        if (assetAmount?.gt(0)) {
          const assetTx = await this.transfer({
            assetAmount,
            recipient: poolAddress,
            memo: Memo.depositMemo(pool.asset, thorAddress, affiliate),
            feeRate,
          });

          return {
            assetTx,
          };
        }

        throw Error('invalid asset amount');
      }

      // sym stake
      if (runeAmount && runeAmount.gt(0) && assetAmount && assetAmount.gt(0)) {
        // 1. send asset tx
        const assetTx = await this.transfer({
          assetAmount,
          recipient: poolAddress,
          memo: Memo.depositMemo(pool.asset, thorAddress, affiliate),
          router,
          feeRate,
        });

        // 2. send rune tx (NOTE: recipient should be empty string)
        const runeTx = await this.transfer({
          assetAmount: runeAmount,
          recipient: THORCHAIN_POOL_ADDRESS,
          memo: Memo.depositMemo(pool.asset, assetAddress, affiliate),
          feeRate,
        });

        return {
          runeTx,
          assetTx,
        };
      }

      // asym deposit for asset
      if (!runeAmount || runeAmount.lte(0)) {
        if (!assetAmount || assetAmount.lte(0)) {
          return await Promise.reject(new Error('Invalid Asset Amount'));
        }

        const assetTx = await this.transfer({
          assetAmount,
          recipient: poolAddress,
          memo: Memo.depositMemo(pool.asset, undefined, affiliate),
          router,
          feeRate,
        });

        return {
          assetTx,
        };
      }

      // asym deposit for rune
      const runeTx = await this.transfer({
        assetAmount: runeAmount,
        recipient: THORCHAIN_POOL_ADDRESS,
        memo: Memo.depositMemo(pool.asset, undefined, affiliate),
        feeRate,
      });

      return {
        runeTx,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * add liquidity to pool
   * @param {CreateLiquidityParams} params
   */
  createLiquidity = async (
    params: CreateLiquidityParams,
  ): Promise<AddLiquidityTxns> => {
    /**
     * 1. get inbound data and check if trading is halted
     * 2. get add liquidity memo
     * 3. add liquidity to pool
     */

    try {
      const {runeAmount, assetAmount} = params;
      const {asset} = assetAmount;
      const {chain} = asset;

      const inboundData = await this.getInboundDataByChain(chain);
      const {address: poolAddress, router} = inboundData;

      // check if trading is halted or not
      if (inboundData.halted) {
        throw Error(
          'Trading is temporarily halted now, please try again later.',
        );
      }

      const feeRate = getFeeRate({inboundData, feeOptionKey: this.feeOption});

      const assetAddress = this.getWalletAddressByChain(chain) || '';
      const thorAddress = this.getWalletAddressByChain(THORChain) || '';

      if (runeAmount.lte(0) || assetAmount.lte(0)) {
        throw Error('Amount should be specified');
      }

      // 1. send asset tx
      const assetTx = await this.transfer({
        assetAmount,
        recipient: poolAddress,
        memo: Memo.depositMemo(asset, thorAddress),
        router,
        feeRate,
      });

      // 2. send rune tx (NOTE: recipient should be empty string)
      const runeTx = await this.transfer({
        assetAmount: runeAmount,
        recipient: THORCHAIN_POOL_ADDRESS,
        memo: Memo.depositMemo(asset, assetAddress),
        feeRate,
      });

      return {
        runeTx,
        assetTx,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * withdraw asset from pool
   * @param {WithdrawParams} params
   */
  withdraw = async (params: WithdrawParams): Promise<TxHash> => {
    /**
     * 1. get pool address
     * 2. get withdraw memo
     * 3. transfer withdraw tx
     */

    const {pool, percent, from, to} = params;

    if ((from === 'sym' && to === 'sym') || from === 'rune') {
      const memo = Memo.withdrawMemo(pool.asset, percent);

      // get thorchain pool address
      const inboundData = await this.getInboundDataByChain(THORChain);
      const {address: poolAddress} = inboundData;
      const feeRate = getFeeRate({inboundData, feeOptionKey: this.feeOption});

      const txHash = await this.transfer({
        assetAmount: AssetAmount.getMinAmountByChain(THORChain),
        recipient: poolAddress,
        memo,
        feeRate,
      });

      return txHash;
    }
    if (from === 'asset') {
      const memo = Memo.withdrawMemo(pool.asset, percent);

      // get inbound address for asset chain
      const inboundData = await this.getInboundDataByChain(pool.asset.chain);
      const {address: poolAddress, router} = inboundData;
      const feeRate = getFeeRate({inboundData, feeOptionKey: this.feeOption});

      const txHash = await this.transfer({
        assetAmount: AssetAmount.getMinAmountByChain(pool.asset.chain),
        recipient: poolAddress,
        memo,
        router,
        feeRate,
      });

      return txHash;
    }

    // from = sym, to = rune or asset

    if (to === 'rune') {
      const memo = Memo.withdrawMemo(pool.asset, percent, Asset.RUNE());

      // get thorchain pool address
      const inboundData = await this.getInboundDataByChain(THORChain);
      const {address: poolAddress} = inboundData;
      const feeRate = getFeeRate({inboundData, feeOptionKey: this.feeOption});

      const txHash = await this.transfer({
        assetAmount: AssetAmount.getMinAmountByChain(THORChain),
        recipient: poolAddress,
        memo,
        feeRate,
      });

      return txHash;
    }

    // from = sym, to = asset
    const memo = Memo.withdrawMemo(pool.asset, percent, pool.asset);

    // get thorchain pool address
    const inboundData = await this.getInboundDataByChain(THORChain);
    const {address: poolAddress} = inboundData;
    const feeRate = getFeeRate({inboundData, feeOptionKey: this.feeOption});

    const txHash = await this.transfer({
      assetAmount: AssetAmount.getMinAmountByChain(THORChain),
      recipient: poolAddress,
      memo,
      feeRate,
    });

    return txHash;
  };

  /**
   * Upgrade asset from pool
   * @param {UpgradeParams} params
   */
  upgrade = async (params: UpgradeParams): Promise<TxHash> => {
    /**
     * 1. get pool address
     * 2. get rune wallet address (BNB.RUNE or ETH.RUNE)
     * 3. get upgrade memo
     * 4. transfer upgrade tx
     */

    try {
      const {runeAmount, recipient: walletAddress} = params;
      const {chain} = runeAmount.asset;

      const inboundData = await this.getInboundDataByChain(chain);
      const {address: poolAddress, router} = inboundData;
      const feeRate = getFeeRate({inboundData, feeOptionKey: this.feeOption});

      if (!walletAddress) {
        throw Error('rune wallet not found');
      }

      const memo = Memo.upgradeMemo(walletAddress);

      if (chain === BNBChain) {
        const txHash = await this.transfer({
          assetAmount: runeAmount,
          recipient: poolAddress,
          memo,
          feeRate,
        });
        return txHash;
      }

      if (chain === ETHChain && router) {
        const txHash = await this.transfer({
          router,
          assetAmount: runeAmount,
          recipient: poolAddress,
          memo,
          feeRate,
        });
        return txHash;
      }

      throw Error('upgrade failed');
    } catch (error) {
      return Promise.reject(error);
    }
  };
}
