import {
  AddressBalance,
  AddressParams,
  Client as BchClient,
  ErrorResponse,
} from '@xchainjs/xchain-bitcoincash';
import {
  TxHash,
  Balance,
  Network,
  TxParams as ClientTxParams,
  FeeOption,
} from '@xchainjs/xchain-client';
import {
  baseAmount,
  Chain,
  BCHChain,
  assetToString,
  AssetBCH,
} from '@xchainjs/xchain-util';
import axios from 'axios';

import {HASKOIN_API_URL} from '../../../settings/config';

import {XdefiClient} from '../../xdefi-sdk';
import {AmountType, Amount, Asset, AssetAmount} from '../entities';
import {IClient} from './client';
import {TxParams, WalletOption} from './types';

export interface IBchChain extends IClient {
  getClient(): BchClient;
}

export class BchChain implements IBchChain {
  private balances: AssetAmount[] = [];

  private client: BchClient;

  public readonly chain: Chain;

  public walletType: WalletOption | null;

  constructor({network = Network.Testnet}: {network?: Network}) {
    this.chain = BCHChain;
    this.client = new BchClient({
      network,
    });
    this.client.setHaskoinURL(HASKOIN_API_URL);

    this.walletType = null;
  }

  /**
   * get xchain-binance client
   */
  getClient(): BchClient {
    return this.client;
  }

  get balance() {
    return this.balances;
  }

  connectKeystore = (phrase: string) => {
    this.client = new BchClient({
      network: this.client.getNetwork(),
      phrase,
    });
    this.client.setHaskoinURL(HASKOIN_API_URL);
    this.walletType = WalletOption.KEYSTORE;
  };

  disconnect = () => {
    this.client.purgeClient();
    this.walletType = null;
  };

  connectXdefiWallet = async (xdefiClient: XdefiClient) => {
    if (!xdefiClient) throw Error('xdefi client not found');

    /**
     * 1. load chain provider
     * 2. patch getAddress method
     * 3. patch transfer method
     */
    xdefiClient.loadProvider(BCHChain);

    const address = await xdefiClient.getAddress(BCHChain);
    this.client.getAddress = () => address;

    const transfer = async (txParams: ClientTxParams) => {
      const {asset, amount, recipient, memo} = txParams;

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

    this.walletType = WalletOption.XDEFI;
  };

  loadBalance = async (): Promise<AssetAmount[]> => {
    try {
      const address = this.client.getAddress();
      const balances: Balance[] = await this.getBalance({
        haskoinUrl: 'https://haskoin.ninerealms.com',
        address,
      });

      this.balances = balances.map((data: Balance) => {
        const {asset, amount} = data;

        const assetObj = new Asset(asset.chain, asset.symbol);
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

  getBalance = async (params: AddressParams): Promise<Balance[]> => {
    const account = await this.getAccount(params);
    if (!account) throw new Error('BCH balance not found');

    const confirmed = baseAmount(account.confirmed, Asset.BCH().decimal);
    const unconfirmed = baseAmount(account.unconfirmed, Asset.BCH().decimal);
    return [
      {
        asset: AssetBCH,
        amount: baseAmount(
          confirmed.amount().plus(unconfirmed.amount()),
          Asset.BCH().decimal,
        ),
      },
    ];
  };

  getAccount = async ({
    haskoinUrl,
    address,
  }: AddressParams): Promise<AddressBalance> => {
    const result: AddressBalance | ErrorResponse = (
      await axios.get(`${haskoinUrl}/bch/address/${address}/balance`)
    ).data;
    if (!result || this.isErrorResponse(result))
      throw new Error(`failed to query account by given address ${address}`);
    return result;
  };

  isErrorResponse = (response: any): response is ErrorResponse => {
    return !!response.error;
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
      const {
        assetAmount,
        recipient,
        memo,
        feeRate,
        feeOption = FeeOption.Fast,
      } = tx;
      const {asset} = assetAmount;
      const amount = baseAmount(assetAmount.amount.baseAmount, asset.decimal);

      const feeRateValue =
        feeRate || (await this.client.getFeeRates())[feeOption];

      const hash = await this.client.transfer({
        asset: asset.getAssetObj(),
        amount,
        recipient,
        memo,
        feeRate: feeRateValue,
      });

      return hash;
    } catch (error) {
      return Promise.reject(error);
    }
  };
}
