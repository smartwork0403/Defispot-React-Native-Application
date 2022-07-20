import {
  TxHash,
  Balance,
  Network,
  FeeOption,
  TxParams as ClientTxParams,
} from '@xchainjs/xchain-client';
import {Client as DogeClient} from '@xchainjs/xchain-doge';
import {
  assetToString,
  baseAmount,
  Chain,
  DOGEChain,
} from '@xchainjs/xchain-util';
import {XdefiClient} from '../../xdefi-sdk';

import {getBlockcypherUrl, getSochainUrl} from '../../../settings/config';

import {AmountType, Amount, Asset, AssetAmount} from '../entities';
import {IClient} from './client';
import {TxParams, WalletOption} from './types';

export interface IDogeChain extends IClient {
  getClient(): DogeClient;
}

export class DogeChain implements IDogeChain {
  private balances: AssetAmount[] = [];

  private client: DogeClient;

  public readonly chain: Chain;

  public walletType: WalletOption | null;

  constructor({network = Network.Testnet}: {network?: Network}) {
    this.chain = DOGEChain;
    this.client = new DogeClient({
      network,
      sochainUrl: getSochainUrl(),
      blockcypherUrl: getBlockcypherUrl(),
    });
    this.walletType = null;
  }

  /**
   * get xchain-binance client
   */
  getClient(): DogeClient {
    return this.client;
  }

  get balance() {
    return this.balances;
  }

  connectKeystore = (phrase: string) => {
    this.client = new DogeClient({
      network: this.client.getNetwork(),
      phrase,
    });
    this.walletType = WalletOption.KEYSTORE;
  };

  connectXdefiWallet = async (xdefiClient: XdefiClient) => {
    if (!xdefiClient) throw Error('xdefi client not found');

    /**
     * 1. load chain provider
     * 2. patch getAddress method
     * 3. patch transfer method
     */
    xdefiClient.loadProvider(DOGEChain);

    const address = await xdefiClient.getAddress(DOGEChain);
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

  disconnect = () => {
    this.client.purgeClient();
    this.walletType = null;
  };

  loadBalance = async (): Promise<AssetAmount[]> => {
    try {
      const address = this.client.getAddress();
      const balances: Balance[] = await this.client.getBalance(address);

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
        feeOption = FeeOption.Average,
      } = tx;
      const {asset} = assetAmount;
      const amount = baseAmount(assetAmount.amount.baseAmount, asset.decimal);

      const feeRateValue =
        feeRate || (await this.client.getFeeRates())[feeOption];

      return await this.client.transfer({
        asset: asset.getAssetObj(),
        amount,
        recipient,
        memo,
        feeRate: feeRateValue,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };
}
