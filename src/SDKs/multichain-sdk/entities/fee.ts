import {COSMOS_DECIMAL} from '@thorwallet/xchain-cosmos';
import {
  BTCChain,
  LTCChain,
  BCHChain,
  ETHChain,
  BNBChain,
  DOGEChain,
  CosmosChain,
} from '@thorwallet/xchain-util';

import {ETH_DECIMAL, BTC_DECIMAL, BNB_DECIMAL} from '../constants';
import {LTC_DECIMAL, BCH_DECIMAL, DOGE_DECIMAL} from '../constants/decimals';
import {Amount} from './amount';
import {Asset} from './asset';
import {AssetAmount} from './assetAmount';

// TODO: replace all of these with xchain's getFee() functions

// Reference issue: https://github.com/thorchain/asgardex-electron/issues/1381
export class NetworkFee {
  public static getNetworkFeeByAsset = ({
    asset,
    gasRate,
    direction,
  }: {
    asset: Asset;
    gasRate: number;
    direction: 'inbound' | 'outbound';
  }): AssetAmount => {
    const multiplier = direction === 'inbound' ? 1 : 3;

    const chain = asset.L1Chain;

    if (chain === BTCChain) {
      return new AssetAmount(
        Asset.BTC(),
        Amount.fromBaseAmount(250 * gasRate, BTC_DECIMAL).mul(multiplier),
      );
    }

    if (chain === LTCChain) {
      return new AssetAmount(
        Asset.LTC(),
        Amount.fromBaseAmount(250 * gasRate, LTC_DECIMAL).mul(multiplier),
      );
    }
    if (chain === DOGEChain) {
      return new AssetAmount(
        Asset.DOGE(),
        Amount.fromBaseAmount(250 * gasRate, DOGE_DECIMAL).mul(multiplier),
      );
    }

    if (chain === BCHChain) {
      return new AssetAmount(
        Asset.BCH(),
        Amount.fromBaseAmount(250 * gasRate, BCH_DECIMAL).mul(multiplier),
      );
    }

    if (chain === ETHChain) {
      if (asset.isETH()) {
        return new AssetAmount(
          Asset.ETH(),
          Amount.fromBaseAmount(38000 * 10 ** 9 * gasRate, ETH_DECIMAL).mul(
            multiplier,
          ),
        );
      }
      // ERC20s cost more gas
      return new AssetAmount(
        Asset.ETH(),
        Amount.fromBaseAmount(75000 * 10 ** 9 * gasRate, ETH_DECIMAL).mul(
          multiplier,
        ),
      );
    }

    if (chain === BNBChain) {
      // if inbound tx, retrieve original amount instead of 1.5x
      if (direction === 'inbound') {
        return new AssetAmount(
          Asset.BNB(),
          Amount.fromBaseAmount(gasRate, BNB_DECIMAL).div(3).mul(2),
        );
      }

      return new AssetAmount(
        Asset.BNB(),
        Amount.fromBaseAmount(gasRate, BNB_DECIMAL).mul(multiplier),
      );
    }
    if (chain === CosmosChain) {
      const decimalDiff = COSMOS_DECIMAL - 8; /* THORCHAIN_DECIMAL */
      const feeRate1e6 = gasRate * 10 ** decimalDiff;
      return new AssetAmount(
        Asset.ATOM(),
        Amount.fromBaseAmount(feeRate1e6, COSMOS_DECIMAL).mul(multiplier),
      );
    }
    const tcMultiplier =
      direction === 'outbound' && asset.synth ? 1 : multiplier;

    // if (chain === THORChain) {
    return new AssetAmount(
      Asset.RUNE(),
      Amount.fromAssetAmount(0.02, Asset.RUNE().decimal).mul(tcMultiplier),
    );
  };
}
