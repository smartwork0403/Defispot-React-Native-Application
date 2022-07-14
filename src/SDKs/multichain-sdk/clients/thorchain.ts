import {
  TxParams as ClientTxParams,
  TxHash,
  Balance,
  Network,
} from '@xchainjs/xchain-client';
import {
  ChainIds,
  Client as ThorClient,
  DepositParam as ClientDepositParam,
} from '@xchainjs/xchain-thorchain';
import {
  assetToString,
  baseAmount,
  Chain,
  THORChain,
  Asset as BasicAsset,
} from '@xchainjs/xchain-util';
import {THORChainLedger} from 'wallet-core/ledger/thorchain';
import {WalletConnectClient} from 'wallet-core/walletconnect';

import {XdefiClient} from '../../xdefi-sdk';
import {
  INSUFFICIENT_RUNE_THRESHOLD_AMOUNT_ERROR,
  INVALID_MEMO_ERROR,
  RUNE_THRESHOLD_AMOUNT,
} from '../constants';
import {AmountType, Amount, AssetAmount, Asset} from '../entities';
import {IClient} from './client';
import {TxParams, WalletOption} from './types';

export type DepositParam = {
  assetAmount: AssetAmount;
  memo?: string;
};
const DEFUALT_CHAINIDS = {
  mainnet: 'thorchain-mainnet-v1',
  stagenet: 'thorchain-stagenet-v2',
  testnet: 'thorchain-testnet-v2',
};

export interface IThorChain extends IClient {
  getClient(): ThorClient;
  deposit(tx: DepositParam): Promise<TxHash>;
}

export class ThorChain implements IThorChain {
  private balances: AssetAmount[] = [];

  private client: ThorClient;

  private ledgerClient: THORChainLedger | null = null;

  public readonly chain: Chain;

  public walletType: WalletOption | null;

  constructor({
    network = Network.Testnet,
    chainIds = DEFUALT_CHAINIDS,
  }: {
    network?: Network;
    chainIds?: ChainIds;
  }) {
    this.chain = THORChain;
    this.client = new ThorClient({
      network,
      chainIds,
    });
    this.walletType = null;
  }

  /**
   * get xchain-binance client
   */
  getClient(): ThorClient {
    return this.client;
  }

  get balance() {
    return this.balances;
  }

  connectKeystore = async (phrase: string) => {
    const chainIds = DEFUALT_CHAINIDS; // await getChainIds(getDefaultClientUrl())
    const clientNetwork = this.client.getNetwork();
    this.client = new ThorClient({
      network: clientNetwork,
      chainIds,
      phrase,
    });
    this.walletType = WalletOption.KEYSTORE;
  };

  disconnect = () => {
    this.client.purgeClient();
    this.walletType = null;
    this.ledgerClient = null;
  };

  connectXdefiWallet = async (xdefiClient: XdefiClient) => {
    if (!xdefiClient) throw Error('xdefi client not found');

    /**
     * 1. load chain provider
     * 2. patch getAddress method
     * 3. patch transfer method
     * 4. patch deposit method
     */
    xdefiClient.loadProvider(THORChain);

    const address = await xdefiClient.getAddress(THORChain);
    this.client.getAddress = () => address;

    const transfer = async (txParams: ClientTxParams) => {
      const {asset, amount, recipient, memo = ''} = txParams;

      if (!asset) throw Error('invalid asset to transfer');

      const txHash = await xdefiClient.transfer({
        asset: assetToString(asset),
        amount: amount.amount().toNumber(),
        decimal: amount.decimal,
        recipient,
        memo,
      });

      return txHash;
    };
    this.client.transfer = transfer;

    const deposit = async (txParams: ClientDepositParam) => {
      const {asset, amount, memo} = txParams;

      if (!asset) throw Error('invalid asset to deposit');

      const txHash = await xdefiClient.depositTHOR({
        asset: assetToString(asset),
        amount: amount.amount().toNumber(),
        decimal: amount.decimal,
        recipient: '',
        memo,
      });

      return txHash;
    };
    this.client.deposit = deposit;

    this.walletType = WalletOption.XDEFI;
  };

  // getAccount = async (
  //   address: string,
  // ): Promise<cosmos.auth.v1beta1.IBaseAccount> => {
  //   const cosmosSDKClient: CosmosSDKClient = this.client.getCosmosClient()
  //   const signer = AccAddress.fromString(address)
  //   const account = await cosmosSDKClient.getAccount(signer)
  //   return account
  // }

  connectTrustWallet = async (walletconnectClient: WalletConnectClient) => {
    // if (!walletconnectClient) throw Error('trustwallet client not found')
    // const address = walletconnectClient.getAddressByChain(THORChain)
    // if (!address) throw Error('thorchain address not found')
    // this.walletType = WalletOption.TRUSTWALLET
    // // patch getAddress method with walletconnect address
    // this.client.getAddress = () => address
    // this.client.transfer = async (txParams: ClientTxParams) => {
    //   const { asset, amount, recipient, memo = '' } = txParams
    //   if (!asset) throw Error('invalid asset')
    //   const account: any = await this.getAccount(address)
    //   if (!account) throw Error('invalid account')
    //   const { account_number: accountNumber, sequence = '0' } = account.value
    //   const sendCoinsMessage: SendCoinsMessage = {
    //     fromAddress: address,
    //     toAddress: recipient,
    //     amounts: [
    //       {
    //         denom: asset?.symbol.toLowerCase(),
    //         amount: amount.amount().toString(),
    //       },
    //     ],
    //   }
    //   const message = {
    //     sendCoinsMessage,
    //   }
    //   const fee: Fee = {
    //     amounts: [],
    //     gas: THORCHAIN_SEND_GAS_FEE,
    //   }
    //   // get tx signing msg
    //   const signRequestMsg: THORChainSendTx = {
    //     accountNumber,
    //     chainId: THORCHAIN_ID,
    //     fee,
    //     memo,
    //     sequence,
    //     messages: [message],
    //   }
    //   // request tx signing to walletconnect
    //   const signedTx = await walletconnectClient.signCustomTransaction({
    //     network: THORCHAIN_NETWORK,
    //     tx: signRequestMsg,
    //   })
    //   // broadcast raw tx
    //   const cosmosSDKClient: CosmosSDKClient = this.client.getCosmosClient()
    //   const signedTxObj = JSON.parse(signedTx)
    //   if (!signedTxObj?.tx) throw Error('tx signing failed')
    //   const stdTx = StdTx.fromJSON(signedTxObj.tx)
    //   const { data }: any = await auth.txsPost(
    //     cosmosSDKClient.sdk,
    //     stdTx,
    //     'block',
    //   )
    //   if (!data.logs) throw Error('Transaction Failed')
    //   // return tx hash
    //   return data?.txhash || ''
    // }
    // this.client.deposit = async (txParams: ClientDepositParam) => {
    //   const { asset, amount, memo } = txParams
    //   if (!asset) throw Error('invalid asset to deposit')
    //   const signer = this.client.getAddress()
    //   const msgNativeTx = msgNativeTxFromJson({
    //     coins: [
    //       {
    //         asset
    //         amount: amount.amount().toString(),
    //       },
    //     ],
    //     memo,
    //     signer,
    //   })
    //   const unsignedStdTx = await buildDepositTx(msgNativeTx)
    //   unsignedStdTx.fee.gas = THORCHAIN_DEPOSIT_GAS_FEE
    //   const account: any = await this.getAccount(signer)
    //   if (!account) throw Error('invalid account')
    //   const { account_number: accountNumber, sequence = '0' } = account.value
    //   const fee: Fee = {
    //     amounts: [],
    //     gas: THORCHAIN_DEPOSIT_GAS_FEE,
    //   }
    //   const unsignedMsg = unsignedStdTx.msg[0] as any
    //   const txMsgType = unsignedMsg.type
    //   const txMsgValue = unsignedMsg.value
    //   // get tx signing msg
    //   const signRequestMsg: THORChainDepositTx = {
    //     accountNumber,
    //     chainId: THORCHAIN_ID,
    //     fee,
    //     memo: '',
    //     sequence,
    //     messages: [
    //       {
    //         rawJsonMessage: {
    //           type: txMsgType,
    //           value: JSON.stringify(txMsgValue),
    //         },
    //       },
    //     ],
    //   }
    //   // request tx signing to walletconnect
    //   const signedTx = await walletconnectClient.signCustomTransaction({
    //     network: THORCHAIN_NETWORK,
    //     tx: signRequestMsg,
    //   })
    //   // broadcast raw tx
    //   const cosmosSDKClient: CosmosSDKClient = this.client.getCosmosClient()
    //   const signedTxObj = JSON.parse(signedTx)
    //   if (!signedTxObj?.tx) throw Error('tx signing failed')
    //   const stdTx = StdTx.fromJSON(signedTxObj.tx)
    //   const { data }: any = await auth.txsPost(
    //     cosmosSDKClient.sdk,
    //     stdTx,
    //     'block',
    //   )
    //   if (!data.logs) throw Error('Transaction Failed')
    //   // return tx hash
    //   return data?.txhash || ''
    // }
  };

  connectLedger = async (addressIndex = 0) => {
    // this.ledgerClient = new THORChainLedger(
    //   this.client.getNetwork(),
    //   addressIndex,
    // )
    // const address = await this.ledgerClient.connect()
    // // patch getAddress method with ledger address
    // this.client.getAddress = () => address
    // this.client.transfer = async (txParams: ClientTxParams) => {
    //   const { asset, amount, recipient, memo = '' } = txParams
    //   if (!this.ledgerClient) throw Error('Ledger connect error')
    //   if (!asset) throw Error('invalid asset')
    //   const account: any = await this.getAccount(address)
    //   if (!account) throw Error('invalid account')
    //   const { account_number: accountNumber, sequence = '0' } = account.value
    //   const sendCoinsMessage: LedgerTypes.SendCoinsMessage = {
    //     amount: [
    //       {
    //         amount: amount.amount().toString(),
    //         denom: asset?.symbol.toLowerCase(),
    //       },
    //     ],
    //     from_address: address,
    //     to_address: recipient,
    //   }
    //   const msg: LedgerTypes.SendMessage = {
    //     type: 'thorchain/MsgSend',
    //     value: sendCoinsMessage,
    //   }
    //   const fee: LedgerTypes.Fee = {
    //     amount: [],
    //     gas: THORCHAIN_SEND_GAS_FEE,
    //   }
    //   // get tx signing msg
    //   const rawSendTx: LedgerTypes.THORChainSendTx = {
    //     account_number: accountNumber,
    //     chain_id: THORCHAIN_ID,
    //     fee,
    //     memo,
    //     msgs: [msg],
    //     sequence,
    //   }
    //   // request tx signing to walletconnect
    //   const signatures = await this.ledgerClient.signTransaction(
    //     JSON.stringify(rawSendTx),
    //   )
    //   if (!signatures) throw Error('tx signing failed')
    //   const txObj = {
    //     msg: [msg],
    //     fee,
    //     memo,
    //     signatures,
    //   }
    //   const stdTx = StdTx.fromJSON(txObj)
    //   // broadcast raw tx
    //   const cosmosSDKClient: CosmosSDKClient = this.client.getCosmosClient()
    //   const { data }: any = await auth.txsPost(
    //     cosmosSDKClient.sdk,
    //     stdTx,
    //     'block',
    //   )
    //   if (!data.logs) throw Error('Transaction Failed')
    //   // return tx hash
    //   return data?.txhash || ''
    // }
    // this.client.deposit = async (txParams: ClientDepositParam) => {
    //   const { asset, amount, memo } = txParams
    //   if (!asset) throw Error('invalid asset to deposit')
    //   if (!this.ledgerClient) throw Error('Ledger connect error')
    //   const signer = this.client.getAddress()
    //   const msgNativeTx = msgNativeTxFromJson({
    //     coins: [
    //       {
    //         asset,
    //         amount: amount.amount().toString(),
    //       },
    //     ],
    //     memo,
    //     signer,
    //   })
    //   const unsignedStdTx = await buildDepositTx(msgNativeTx)
    //   unsignedStdTx.fee.gas = THORCHAIN_DEPOSIT_GAS_FEE
    //   const account: any = await this.getAccount(signer)
    //   if (!account) throw Error('invalid account')
    //   const { account_number: accountNumber, sequence = '0' } = account.value
    //   const fee: LedgerTypes.Fee = {
    //     amount: [],
    //     gas: THORCHAIN_DEPOSIT_GAS_FEE,
    //   }
    //   const unsignedMsgs = orderJSON(unsignedStdTx.msg)
    //   // get tx signing msg
    //   const rawSendTx: LedgerTypes.THORChainDepositTx = {
    //     account_number: accountNumber,
    //     chain_id: THORCHAIN_ID,
    //     fee,
    //     memo: '',
    //     msgs: unsignedMsgs,
    //     sequence,
    //   }
    //   const minifiedTx = stringifyKeysInOrder(rawSendTx)
    //   // request tx signing to walletconnect
    //   const signatures = await this.ledgerClient.signTransaction(minifiedTx)
    //   if (!signatures) throw Error('tx signing failed')
    //   const txObj = {
    //     msg: unsignedMsgs,
    //     fee,
    //     memo: '',
    //     signatures,
    //   }
    //   // broadcast raw tx
    //   const cosmosSDKClient: CosmosSDKClient = this.client.getCosmosClient()
    //   const stdTx = StdTx.fromJSON(txObj)
    //   const { data }: any = await auth.txsPost(
    //     cosmosSDKClient.sdk,
    //     stdTx,
    //     'block',
    //   )
    //   if (!data.logs) throw Error('Transaction Failed')
    //   // return tx hash
    //   return data?.txhash || ''
    // }
    // this.walletType = WalletOption.LEDGER
  };

  verifyLedgerAddress = async (): Promise<string> => {
    if (!this.ledgerClient) throw Error('Ledger not connected');

    const account = await this.ledgerClient.showAddressAndPubKey();

    return account.bech32_address;
  };

  getAssetFromBalance = (data: Balance): Asset => {
    const {asset} = data;

    // synth assets
    if (asset.symbol.includes('/')) {
      const nativeChain = asset.symbol.split('/')[0] as Chain;
      const nativeSymbol = asset.symbol.split('/')[1];
      return new Asset(nativeChain, nativeSymbol, true);
    }

    // non-synth asset (RUNE)
    return new Asset(asset.chain, asset.symbol);
  };

  /**
   * Get denomination with chainname from Asset
   *
   * @param {Asset} asset
   * @returns {string} The denomination with chainname of the given asset.
   */
  getDenomWithChain = (asset: BasicAsset): string => {
    return `${Chain.THORChain}.${asset.symbol.toUpperCase()}`;
  };

  loadBalance = async (): Promise<AssetAmount[]> => {
    try {
      const address = this.client.getAddress();
      const balances: Balance[] = await this.client.getBalance(address);

      this.balances = balances.map((data: Balance) => {
        const {amount} = data;

        const assetObj = this.getAssetFromBalance(data);
        const amountObj = new Amount(
          amount.amount(),
          AmountType.BASE_AMOUNT,
          assetObj.decimal,
        );

        return new AssetAmount(assetObj, amountObj);
      });

      return this.balances;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  hasAmountInBalance = async (assetAmount: AssetAmount): Promise<boolean> => {
    try {
      await this.loadBalance();

      const assetBalance = this.balances.find((data: AssetAmount) =>
        data.asset.eq(assetAmount.asset),
      );

      if (!assetBalance) return false;

      return assetBalance.amount.gte(assetAmount.amount);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  getAssetBalance = async (asset: Asset): Promise<AssetAmount> => {
    try {
      await this.loadBalance();

      const assetBalance = this.balances.find((data: AssetAmount) =>
        data.asset.eq(asset),
      );

      if (!assetBalance)
        return new AssetAmount(asset, Amount.fromAssetAmount(0, asset.decimal));

      return assetBalance;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * transfer on binance chain
   * @param {TxParams} tx transfer parameter
   */
  transfer = async (tx: TxParams): Promise<TxHash> => {
    // use xchainjs-client standard internally
    try {
      const {assetAmount, recipient, memo = ''} = tx;
      const {asset} = assetAmount;
      const amount = baseAmount(assetAmount.amount.baseAmount, asset.decimal);

      const res = await this.client.transfer({
        asset: asset.getAssetObj(),
        amount,
        recipient,
        memo,
      });

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  async deposit(tx: DepositParam): Promise<TxHash> {
    try {
      const {assetAmount, memo} = tx;
      const {asset} = assetAmount;
      const amount = baseAmount(assetAmount.amount.baseAmount, asset.decimal);

      if (!memo) throw new Error(INVALID_MEMO_ERROR);

      // Note: retain RUNE threshold amount for gas purpose
      const hasThresholdAmount = await this.hasAmountInBalance(
        new AssetAmount(
          Asset.RUNE(),
          Amount.fromAssetAmount(RUNE_THRESHOLD_AMOUNT, Asset.RUNE().decimal),
        ),
      );

      if (!hasThresholdAmount) {
        throw new Error(INSUFFICIENT_RUNE_THRESHOLD_AMOUNT_ERROR);
      }

      const res = await this.client.deposit({
        asset: asset.getAssetObj(),
        amount,
        memo,
      });

      return res;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
