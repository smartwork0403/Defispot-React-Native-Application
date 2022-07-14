// https://docs.thorchain.org/how-it-works/governance#mimir

import {useMemo} from 'react';

import {Amount, SupportedChain} from '../SDKs/multichain-sdk';

import {useMidgard} from '../redux/midgard/hooks';

export const useMimir = () => {
  const {networkData, mimir} = useMidgard();
  const maxLiquidityRuneMimir = mimir?.MAXIMUMLIQUIDITYRUNE;
  const haltETHTrading = mimir?.HALTETHTRADING !== 0;
  const haltBTCTrading = mimir?.HALTBTCTRADING !== 0;
  const haltLTCTrading = mimir?.HALTLTCTRADING !== 0;
  const haltTrading = mimir?.HALTTRADING !== 0;
  const haltTHORChain = mimir?.HALTTHORCHAIN !== 0;
  const haltDOGETrading = mimir?.HALTTHORCHAIN !== 0;
  const haltBCHTrading = mimir?.HALTBCHTRADING !== 0;
  const haltBNBTrading = mimir?.HALTBNBTRADING !== 0;
  const haltGAIATrading = mimir?.HALTGAIATRADING !== 0;
  const haltETHChain = mimir?.HALTETHCHAIN !== 0;
  const haltBTCChain = mimir?.HALTBTCCHAIN !== 0;
  const haltLTCChain = mimir?.HALTDOGECHAIN !== 0;
  const haltDOGEChain = mimir?.HALTDOGECHAIN !== 0;
  const haltBCHChain = mimir?.HALTBCHCHAIN !== 0;
  const haltBNBChain = mimir?.HALTBNBCHAIN !== 0;
  const haltGAIAChain = mimir?.HALTGAIACHAIN !== 0;
  const haltedChains = useMemo(
    (): Record<SupportedChain, boolean> => ({
      THOR: haltTHORChain || haltTrading,
      ETH: haltETHTrading || haltETHChain || haltTrading,
      BTC: haltBTCTrading || haltBTCChain || haltTrading,
      LTC: haltLTCTrading || haltLTCChain || haltTrading,
      BCH: haltBCHTrading || haltBCHChain || haltTrading,
      BNB: haltBNBTrading || haltBNBChain || haltTrading,
      DOGE: haltDOGEChain || haltDOGETrading || haltTrading,
      GAIA: haltGAIAChain || haltGAIATrading || haltTrading,
    }),
    [
      haltTHORChain,
      haltTrading,
      haltETHTrading,
      haltETHChain,
      haltBTCTrading,
      haltBTCChain,
      haltLTCTrading,
      haltLTCChain,
      haltBCHTrading,
      haltBCHChain,
      haltBNBTrading,
      haltBNBChain,
      haltDOGEChain,
      haltDOGETrading,
      haltGAIAChain,
      haltGAIATrading,
    ],
  );

  const maxLiquidityRune = Amount.fromMidgard(maxLiquidityRuneMimir);
  const totalPooledRune = Amount.fromMidgard(networkData?.totalPooledRune);

  const isFundsCapReached: boolean = useMemo(() => {
    if (!maxLiquidityRuneMimir) {
      return false;
    }

    // totalPooledRune >= maxLiquidityRune - 100k RUNE
    return maxLiquidityRune
      .sub(Amount.fromMidgard(100000 * 10 ** 8))
      .lte(totalPooledRune);
  }, [totalPooledRune, maxLiquidityRune, maxLiquidityRuneMimir]);

  const capPercent = useMemo(() => {
    if (!maxLiquidityRuneMimir) {
      return null;
    }

    const poolLimit = maxLiquidityRune.sub(
      Amount.fromMidgard(100000 * 10 ** 8),
    );

    return `${totalPooledRune.div(poolLimit).mul(100).toFixed(1)}%`;
  }, [totalPooledRune, maxLiquidityRune, maxLiquidityRuneMimir]);

  return {
    haltedChains,
    totalPooledRune,
    maxLiquidityRune,
    isFundsCapReached,
    capPercent,
  };
};
