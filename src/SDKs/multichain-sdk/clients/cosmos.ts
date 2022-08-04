import {TxHash, Balance, Network} from '@thorwallet/xchain-client';
import {Client as CosmosClient, ClientUrls} from '@thorwallet/xchain-cosmos';
import {baseAmount, Chain, CosmosChain} from '@thorwallet/xchain-util';

import {AmountType, Amount, Asset, AssetAmount} from '../entities';
import {IClient} from './client';
import {TxParams, WalletOption} from './types';

export interface ICosmosChain extends IClient {
  getClient(): CosmosClient;
}

export class GaiaChain implements ICosmosChain {
  private balances: AssetAmount[] = [];

  private client: CosmosClient;

  public readonly chain: Chain;

  public walletType: WalletOption | null;

  constructor({network = Network.Testnet}: {network?: Network}) {
    this.chain = CosmosChain;
    const mainClientUrl =
      ' https://cosmoshub-4--lcd--full.datahub.figment.io/apikey/1fdb2081966af7be9dc53ac5f463ccd5';
    const clientUrls: ClientUrls = {
      [Network.Testnet]: 'https://rest.sentry-02.theta-testnet.polypore.xyz',
      [Network.Stagenet]: mainClientUrl,
      [Network.Mainnet]: mainClientUrl,
    };
    this.client = new CosmosClient({
      network,
      clientUrls,
    });

    this.walletType = null;
  }

  /**
   * get xchain-binance client
   */
  getClient(): CosmosClient {
    return this.client;
  }

  get balance() {
    return this.balances;
  }

  connectKeystore = (phrase: string) => {
    const mainClientUrl =
      ' https://cosmoshub-4--lcd--full.datahub.figment.io/apikey/1fdb2081966af7be9dc53ac5f463ccd5';
    const clientUrls: ClientUrls = {
      [Network.Testnet]: 'https://rest.sentry-02.theta-testnet.polypore.xyz',
      [Network.Stagenet]: mainClientUrl,
      [Network.Mainnet]: mainClientUrl,
    };
    this.client = new CosmosClient({
      network: this.client.getNetwork(),
      clientUrls,
      phrase,
    });
    this.walletType = WalletOption.KEYSTORE;
  };

  disconnect = () => {
    this.client.purgeClient();
    this.walletType = null;
  };

  loadBalance = async (): Promise<AssetAmount[]> => {
    try {
      const address = this.client.getAddress();
      const balances: Balance[] = await this.client.getBalance(address);
      console.log('bale', balances);
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
      const {assetAmount, recipient, memo} = tx;
      const {asset} = assetAmount;
      const amount = baseAmount(assetAmount.amount.baseAmount, asset.decimal);

      return await this.client.transfer({
        asset: asset.getAssetObj(),
        amount,
        recipient,
        memo,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  };
}
