import {useMemo} from 'react';

import BigNumber from 'bignumber.js';
import {LiquidityType} from '../common/enums/LiquidityType';
import {
  Amount,
  AmountType,
  Asset,
  Liquidity,
  Percent,
  Pool,
  Price,
} from '../SDKs/multichain-sdk';

import {useAppSelector} from '../redux/hooks';
import {useMidgard} from '../redux/midgard/hooks';
import {selectAvailablePools} from '../redux/midgard/slice';
import {PoolMemberData, PoolShareType} from '../redux/midgard/types';

export const useLiquidity = (
  pool: Pool,
  lpType = PoolShareType.SYM,
  percent = 100,
) => {
  const {chainMemberDetails} = useMidgard();
  const pools = useAppSelector(selectAvailablePools);

  const poolMemberData: PoolMemberData | null = useMemo(() => {
    if (!pool) {
      return null;
    }
    return (
      chainMemberDetails?.[pool.asset.chain]?.[pool.detail.asset.toString()] ??
      null
    );
  }, [pool, chainMemberDetails]);

  const liquidityType = useMemo(() => {
    if (lpType === PoolShareType.RUNE_ASYM) {
      return LiquidityType.RUNE;
    }
    if (lpType === PoolShareType.ASSET_ASYM) {
      return LiquidityType.ASSET;
    }
    return LiquidityType.SYMMETRICAL;
  }, [lpType]);

  const memberPoolData = useMemo(() => {
    if (!poolMemberData) {
      return null;
    }
    if (lpType === PoolShareType.RUNE_ASYM) {
      return poolMemberData.runeAsym;
    }
    if (lpType === PoolShareType.ASSET_ASYM) {
      return poolMemberData.assetAsym;
    }
    if (lpType === PoolShareType.SYM) {
      return poolMemberData.sym;
    }

    return null;
  }, [poolMemberData, lpType]);

  const liquidityEntity = useMemo(() => {
    if (!memberPoolData || !pool) {
      return null;
    }
    const {liquidityUnits} = memberPoolData;

    return new Liquidity(pool, Amount.fromMidgard(liquidityUnits));
  }, [pool, memberPoolData]);

  const {runeAmount, assetAmount} = useMemo(() => {
    if (!liquidityEntity) {
      return {
        runeAmount: Amount.fromMidgard(0),
        assetAmount: Amount.fromMidgard(0),
      };
    }

    if (liquidityType === LiquidityType.SYMMETRICAL) {
      return liquidityEntity.getSymWithdrawAmount(
        new Percent(percent, AmountType.BASE_AMOUNT),
      );
    }

    if (liquidityType === LiquidityType.RUNE) {
      const amount = liquidityEntity.getAsymRuneWithdrawAmount(
        new Percent(percent, AmountType.BASE_AMOUNT),
      );

      return {
        runeAmount: amount,
        assetAmount: Amount.fromMidgard(0),
      };
    }

    const amount = liquidityEntity.getAsymAssetWithdrawAmount(
      new Percent(percent, AmountType.BASE_AMOUNT),
    );

    return {
      runeAmount: Amount.fromMidgard(0),
      assetAmount: amount,
    };
  }, [liquidityType, percent, liquidityEntity]);

  const runeAssetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: Asset.RUNE(),
        pools,
        priceAmount: runeAmount,
      }),
    [runeAmount, pools],
  );

  const assetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: pool.asset,
        pools,
        priceAmount: assetAmount,
      }),
    [pool, assetAmount, pools],
  );

  const liquidity = useMemo(
    () => new BigNumber(assetPriceInUSD.price).plus(runeAssetPriceInUSD.price),
    [assetPriceInUSD, runeAssetPriceInUSD],
  );

  return {
    liquidity,
  };
};
