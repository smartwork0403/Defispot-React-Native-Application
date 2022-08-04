//@ts-ignore
import React, {useCallback, useEffect, useState, useMemo} from 'react';

import {useDispatch} from 'react-redux';

import {FeeOption} from '@thorwallet/xchain-client';
import {
  Amount,
  AmountType,
  Asset,
  AssetAmount,
  doesWalletSupportAsset,
  getWalletAddressByChain,
  NetworkFee,
  Percent,
  Price,
  Swap,
  SynthType,
} from '../SDKs/multichain-sdk';

import {AFFILIATE_FEE} from '../SDKs/multichain-sdk/config';

import {actions as AppActions} from '../redux/app/app-slice';
import {useApp} from '../redux/app/hooks';
import {useAppSelector} from '../redux/hooks';
import {useMidgard} from '../redux/midgard/hooks';
import {selectAvailablePools} from '../redux/midgard/slice';
import {TxTrackerType} from '../redux/midgard/types';
import {useServer} from '../redux/server/server.hooks';

import {useApprove} from '../hooks/useApprove';
import {useNetworkFee} from '../hooks/useNetworkFee';
import {useTxTracker} from '../hooks/useTxTracker';

import {multichain} from '../services/multichain';

import {translateErrorMsg} from '../helpers/error';
import {getGasRateByChain} from '../helpers/networkFee';

import {useAsset} from './useAsset';
import {useBalance} from './useBalance';
import {useWallet} from './useWallet';

export const useSwap = () => {
  const dispatch = useDispatch();
  const {
    setInputAsset,
    setOutputAsset,
    inputAsset,
    outputAsset,
    setFeeOptionType,
  } = useApp();
  const {setIsConnectWalletModalOpen} = useWallet();
  const {submitTransaction, pollTransaction, setTxFailed} = useTxTracker();
  const {getMaxBalance} = useBalance();
  const {wallet, isConnected} = useWallet();
  const {poolLoading, inboundData} = useMidgard();
  const {slippageTolerance, setSlippageTolerance} = useApp();
  const {inboundFee, outboundFee} = useNetworkFee({
    inputAsset,
    outputAsset,
  });
  const {isApproved} = useApprove(inputAsset, !!wallet);
  const {referringAffiliateInfo} = useServer();

  const [recipient, setRecipient] = useState('');
  const [isSwapNowShown, setIsSwapNowShown] = useState(false);
  const [isApproveNowShown, setIsApproveNowShown] = useState(false);
  const [isCompletedOrder, setIsCompletedOrder] = useState(false);
  const [inputAmount, setInputAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, 8),
  );

  const pools = useAppSelector(selectAvailablePools);

  useEffect(() => {
    if (wallet) {
      const address = getWalletAddressByChain(wallet, outputAsset.L1Chain);
      setRecipient(address || '');
    }
  }, [wallet, outputAsset]);

  const handleUpdateTolerance = (tolerance: number) => {
    setSlippageTolerance(tolerance);
  };

  const handleUpdateFeeOptionType = (type: FeeOption) => {
    setFeeOptionType(type);
  };

  // TODO: Review all ways a user could potentially swap to the wrong address. (also, BCH breaks if passed an invalid address)
  const isValidAddress = useMemo(() => {
    try {
      return multichain.validateAddress({
        chain: outputAsset.L1Chain,
        address: recipient,
      });
    } catch (err) {
      return false;
    }
  }, [outputAsset, recipient]);

  const walletSupportsAsset = useMemo(
    () => doesWalletSupportAsset({wallet, inputAsset}),
    [wallet, inputAsset],
  );

  const totalUSDFees = useMemo(() => {
    if (poolLoading) {
      return null;
    }

    const feePrice = new Price({
      baseAsset: inboundFee.asset,
      pools,
      priceAmount: inboundFee?.amount,
    });

    const outboundFeePrice = new Price({
      baseAsset: outboundFee?.asset as Asset,
      pools,
      priceAmount: outboundFee?.amount,
    });
    return Amount.fromAssetAmount(feePrice.raw(), 8).add(
      Amount.fromAssetAmount(outboundFeePrice.raw(), 8),
    );
  }, [
    poolLoading,
    inboundFee.asset,
    inboundFee?.amount,
    pools,
    outboundFee?.asset,
    outboundFee?.amount,
  ]);

  const feesAreTooHigh = useMemo(() => {
    const inputPrice = new Price({
      baseAsset: inputAsset,
      pools,
      priceAmount: inputAmount,
    });

    return totalUSDFees?.gt(Amount.fromAssetAmount(inputPrice.raw(), 8));
  }, [inputAmount, inputAsset, pools, totalUSDFees]);

  const swap: Swap | null = useMemo(() => {
    if (poolLoading) {
      return null;
    }

    try {
      const inputAssetAmount = new AssetAmount(inputAsset, inputAmount);

      const inboundFeeInInputAsset = new AssetAmount(
        inputAsset,
        Amount.fromAssetAmount(
          inboundFee.totalPriceIn(inputAsset, pools).price,
          inputAsset.decimal,
        ),
      );
      const outboundFeeInOutputAsset = outboundFee
        ? new AssetAmount(
            outputAsset,
            Amount.fromAssetAmount(
              outboundFee.totalPriceIn(outputAsset, pools).price,
              outputAsset.decimal,
            ),
          )
        : new AssetAmount(
            outputAsset,
            Amount.fromAssetAmount(0, outputAsset.decimal),
          );

      return new Swap({
        inputAsset,
        outputAsset,
        pools,
        amount: inputAssetAmount,
        slip: slippageTolerance,
        fee: {
          inboundFee: inboundFeeInInputAsset,
          outboundFee: outboundFeeInOutputAsset,
        },
      });
    } catch (error) {
      return null;
    }
  }, [
    inputAsset,
    outputAsset,
    pools,
    inputAmount,
    slippageTolerance,
    poolLoading,
    inboundFee,
    outboundFee,
  ]);

  const slipPercent: string = useMemo(
    () =>
      (swap ? swap.slip : new Percent(0)).toSignificantNumber(2, {
        decimalSeparator: '.',
      }),
    [swap],
  );

  const isToleranceExceeded = useMemo(() => {
    const slippage = slipPercent;

    return +slippage > slippageTolerance;
  }, [slipPercent, slippageTolerance]);

  const handleApprove = useCallback(() => {
    if (isConnected && swap) {
      setIsApproveNowShown(true);
    } else {
      dispatch(
        AppActions.setNotification({
          type: 'error',
          text: 'tradePage:swap-module.wallet-not-found',
        }),
      );
    }
  }, [dispatch, isConnected, swap]);

  const handleSwap = useCallback(() => {
    if (isConnected && swap) {
      if (!walletSupportsAsset) {
        dispatch(
          AppActions.setNotification({
            type: 'error',
            text: 'tradePage:swap-module.wallet-does-not-support-asset',
          }),
        );
        return;
      }
      if (swap.hasInSufficientFee) {
        dispatch(
          AppActions.setNotification({
            type: 'error',
            text: 'tradePage:swap-module.swap-insufficient-fee',
          }),
        );
        return;
      }
      if (!isValidAddress) {
        dispatch(
          AppActions.setNotification({
            type: 'error',
            text: 'tradePage:swap-module.invalid-recipient-address',
          }),
        );
        return;
      }
      if (isToleranceExceeded) {
        dispatch(
          AppActions.setNotification({
            type: 'error',
            text: 'Slippage exceeds chosen slip tolerance',
          }),
        );
        return;
      }
      if (isApproved !== null && !isApproved && isConnected) {
        handleApprove();
      } else {
        setIsSwapNowShown(true);
      }
    } else {
      dispatch(
        AppActions.setNotification({
          type: 'error',
          text: 'tradePage:swap-module.wallet-not-found',
        }),
      );
    }
  }, [
    dispatch,
    isConnected,
    swap,
    isValidAddress,
    isApproved,
    isToleranceExceeded,
    walletSupportsAsset,
    handleApprove,
  ]);

  const handleChangeRecipient = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const addr = e.target.value;
      setRecipient(addr);
    },
    [],
  );
  const chargeAffiliate = useMemo(() => {
    const RuneAsset = Asset.RUNE();
    const inputAssetAmount = new AssetAmount(inputAsset, inputAmount);
    const assetAmountInRune = inputAssetAmount.totalPriceIn(
      Asset.RUNE(),
      pools,
    );
    const runeGasFee = getGasRateByChain({
      inboundData,
      chain: RuneAsset.chain,
    });
    const networkFee = NetworkFee.getNetworkFeeByAsset({
      asset: Asset.RUNE(),
      gasRate: runeGasFee,
      direction: 'inbound',
    });
    if (
      assetAmountInRune.price
        .multipliedBy(AFFILIATE_FEE)
        .lt(networkFee.assetAmount)
    ) {
      return false;
    }
    return true;
  }, [inboundData, inputAmount, inputAsset, pools]);

  // const handleConfirm = () => {
  //   setIsCompletedOrder(true)
  //   setIsSwapNowShown(false)
  // }
  const handleConfirm = useCallback(async () => {
    // setIsSwapNowShown(false)
    if (wallet && swap) {
      const trackerType = getSwapTrackerType(swap);

      const trackId = submitTransaction({
        type: trackerType,
        submitTx: {
          inAssets: [
            {
              asset: swap.inputAsset.toString(),
              amount: swap.inputAmount.toSignificant(6),
            },
          ],
          outAssets: [
            {
              asset: swap.outputAsset.toString(),
              amount: swap.outputAmountAfterFee.toSignificant(6),
            },
          ],
        },
      });
      try {
        const txHash = await multichain.swap(
          swap,
          recipient,
          referringAffiliateInfo.affiliateAddress,
          chargeAffiliate,
        );

        pollTransaction({
          type: trackerType,
          uuid: trackId,
          submitTx: {
            inAssets: [
              {
                asset: swap.inputAsset.toString(),
                amount: swap.inputAmount.toSignificant(6),
              },
            ],
            outAssets: [
              {
                asset: swap.outputAsset.toString(),
                amount: swap.outputAmountAfterFee.toSignificant(6),
              },
            ],
            txID: txHash,
          },
        });
        return txHash;
      } catch (error: any) {
        setTxFailed(trackId);
        const description = translateErrorMsg(error?.toString());
        dispatch(
          AppActions.setNotification({
            type: 'error',
            text: description,
          }),
        );
        return 'error';
      }
    }
  }, [
    dispatch,
    wallet,
    swap,
    submitTransaction,
    chargeAffiliate,
    recipient,
    referringAffiliateInfo.affiliateAddress,
    pollTransaction,
    setTxFailed,
  ]);

  const affiliateFee = useMemo(
    () =>
      !inputAsset.isLTC() &&
      !inputAsset.isBTC() &&
      !inputAsset.isDOGE() &&
      chargeAffiliate
        ? inputAmount.mul(AFFILIATE_FEE)
        : new Amount(0, AmountType.ASSET_AMOUNT, 4),
    [chargeAffiliate, inputAmount, inputAsset],
  );

  const outputAmount: Amount = useMemo(() => {
    if (swap) {
      return swap.outputAmountAfterFee.amount;
    }

    return Amount.fromAssetAmount(0, 8);
  }, [swap]);

  const {tokenPriceInUSD: outputTokenPriceUSD} = useAsset(
    outputAsset,
    outputAmount,
  );

  const minReceive: Amount = useMemo(
    () => (swap ? swap.minOutputAmount : Amount.fromAssetAmount(0, 8)),
    [swap],
  );

  const maxInputBalance: Amount = useMemo(
    () => getMaxBalance(inputAsset),
    [inputAsset, getMaxBalance],
  );

  const sufficientFunds = useMemo(
    () => maxInputBalance.gte(inputAmount),
    [inputAmount, maxInputBalance],
  );

  const handleConfirmApprove = useCallback(async () => {
    setIsApproveNowShown(false);

    if (wallet) {
      // register to tx tracker
      const trackId = submitTransaction({
        type: TxTrackerType.Approve,
        submitTx: {
          inAssets: [
            {
              asset: inputAsset.toString(),
              amount: '0', // not needed for approve tx
            },
          ],
        },
      });

      try {
        const txHash = await multichain.approveAsset(inputAsset);
        if (txHash) {
          // start polling
          pollTransaction({
            type: TxTrackerType.Swap,
            uuid: trackId,
            submitTx: {
              inAssets: [
                {
                  asset: inputAsset.toString(),
                  amount: '0', // not needed for approve tx
                },
              ],
              txID: txHash,
            },
          });
        }
      } catch (error) {
        setTxFailed(trackId);
        dispatch(
          AppActions.setNotification({
            type: 'error',
            text: 'tradePage:swap-module.approve-failed',
          }),
        );
      }
    }
  }, [
    dispatch,
    wallet,
    submitTransaction,
    inputAsset,
    pollTransaction,
    setTxFailed,
  ]);

  return {
    handleApprove,
    setInputAmount,
    setInputAsset,
    setOutputAsset,
    setIsConnectWalletModalOpen,
    handleSwap,
    setIsSwapNowShown,
    setIsCompletedOrder,
    handleConfirm,
    setIsApproveNowShown,
    handleUpdateTolerance,
    handleUpdateFeeOptionType,
    handleConfirmApprove,
    setRecipient,
    handleChangeRecipient,
    totalUSDFees,
    chargeAffiliate,
    inboundData,
    affiliateFee,
    isValidAddress,
    recipient,
    isSwapNowShown,
    inputAmount,
    outputAsset,
    isApproved,
    isApproveNowShown,
    isCompletedOrder,
    isConnected,
    sufficientFunds,
    inputAsset,
    outputAmount,
    outputTokenPriceUSD,
    slipPercent,
    feesAreTooHigh,
    inboundFee,
    minReceive,
    outboundFee,
    maxInputBalance,
    walletSupportsAsset,
    isToleranceExceeded,
  };
};
const getSwapTrackerType = (swap: Swap): TxTrackerType => {
  if (swap.inputAsset.synth || swap.outputAsset.synth) {
    if (swap.synthType === SynthType.MINT) {
      return TxTrackerType.Mint;
    }
    if (swap.synthType === SynthType.REDEEM) {
      return TxTrackerType.Redeem;
    }
  }

  return TxTrackerType.Swap;
};
