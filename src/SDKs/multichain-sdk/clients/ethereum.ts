// import {toast} from 'react-toastify';

import {BigNumber as BN} from '@ethersproject/bignumber';
import {hexlify} from '@ethersproject/bytes';
import {toUtf8Bytes} from '@ethersproject/strings';
import WalletConnectProvider from '@walletconnect/web3-provider';
import {TxHash, Balance, Network, FeeOption} from '@thorwallet/xchain-client';
import {
  Client as EthClient,
  ETHAddress,
  getTokenAddress,
  TxOverrides,
} from '@thorwallet/xchain-ethereum';
import {
  assetToString,
  baseAmount,
  Chain,
  ETHChain,
  AssetETH,
} from '@thorwallet/xchain-util';
import BigNumber from 'bignumber.js';
import {ethers, Wallet} from 'ethers';
import {parseUnits} from 'ethers/lib/utils';
import {MetaMaskClient} from '../../metamask-sdk';
import {WalletConnectClient} from '../../wallet-core/walletconnect';

import {ETH_DECIMAL} from '../../multichain-sdk/constants';
import {getGasPrice} from '../../multichain-sdk/utils/gas';

import {REACT_APP_MOCK_PHRASE} from '../../../settings/config';

import {XdefiClient} from '../../xdefi-sdk';
import {
  ETHERSCAN_API_KEY,
  ETHPLORER_API_KEY,
  INFURA_PROJECT_ID,
} from '../config';
import {
  SIMPLE_GAS_COST_VALUE,
  BASE_TOKEN_GAS_COST_VALUE,
} from '../constants/amount';
import {erc20ABI} from '../constants/erc20.abi';
import {ETHAssets} from '../constants/erc20Assets';
import {TCRopstenAbi} from '../constants/thorchain-ropsten.abi';
import {AmountType, Amount, Asset, AssetAmount} from '../entities';
import {IClient} from './client';
import {TxParams, ApproveParams, DepositParams, WalletOption} from './types';

// from https://github.com/MetaMask/metamask-extension/blob/ee205b893fe61dc4736efc576e0663189a9d23da/ui/app/pages/send/send.constants.js#L39
// and based on recommendations of https://ethgasstation.info/blog/gas-limit/
export const SIMPLE_GAS_COST: ethers.BigNumber = BN.from(SIMPLE_GAS_COST_VALUE);
export const BASE_TOKEN_GAS_COST: ethers.BigNumber = BN.from(
  BASE_TOKEN_GAS_COST_VALUE,
);

export interface IEthChain extends IClient {
  getClient(): EthClient;
  getERC20AssetDecimal(asset: Asset): Promise<number>;
  isApproved({
    contractAddress: spender,
    spenderAddress: sender,
  }: ApproveParams): Promise<boolean>;
  approve({
    contractAddress: spender,
    spenderAddress: sender,
  }: ApproveParams): Promise<TxHash>;
}
interface EthCallParams {
  walletIndex: number;
  contractAddress: string;
  abi: ethers.ContractInterface;
  funcName: string;
  funcParams: Array<any>;
}
export const getETHClient = (network: Network, phrase?: string) => {
  return new EthClient({
    network,
    phrase,
    etherscanApiKey: ETHERSCAN_API_KEY,
    ethplorerApiKey: ETHPLORER_API_KEY,
    infuraCreds: {projectId: INFURA_PROJECT_ID},
  });
};

export class EthChain implements IEthChain {
  private balances: AssetAmount[] = [];

  private client: EthClient;

  public readonly chain: Chain;

  public walletType: WalletOption | null;

  constructor({network = Network.Testnet}: {network?: Network}) {
    this.chain = ETHChain;
    this.client = getETHClient(network);
    // NOTE: we need to do this to make sure we dont have valid wallet
    // because somehow feunds ended up in the mock wallet
    this.client.transfer = () => {
      // toast.error('wallet error, please reconnect');
      return new Promise(resolve => {
        resolve('wallet error, please reconnect');
      });
    };

    this.walletType = null;
  }

  /**
   * get xchain-binance client
   */
  getClient(): EthClient {
    return this.client;
  }

  get balance() {
    return this.balances;
  }

  connectKeystore = (phrase: string) => {
    const network = this.client.getNetwork();
    this.client = getETHClient(network, phrase);
    this.walletType = WalletOption.KEYSTORE;
  };

  disconnect = () => {
    this.client.purgeClient();
    this.walletType = null;
  };

  nullifyPhrase = () => {
    try {
      this.client.purgeClient();
    } catch (error) {
      // sqelched error on purpose, we just want ot ensure there is no phrase stored
    }
  };

  connectMetaMask = async (metamaskClient: MetaMaskClient) => {
    if (!metamaskClient) throw Error('metamask client not found');

    /**
     * 1. load chain provider
     * 2. patch getAddress method
     * 3. patch eth wallet object
     * 4. patch approve method
     * 5. patch transfer method
     * 6. patch call method
     */
    metamaskClient.loadProvider();

    const network = this.client.getNetwork();
    this.client = getETHClient(network, REACT_APP_MOCK_PHRASE);
    // NOTE: we need to do this to make sure we dont have valid wallet
    // because somehow feunds ended up in the mock wallet
    this.client.transfer = () => {
      // toast.error('wallet error, please reconnect');
      return new Promise(resolve => {
        resolve('wallet error, please reconnect');
      });
    };

    const address = await metamaskClient.getAddress();

    this.client.getAddress = () => address;

    // patch eth wallet
    const ethWallet = this.client.getWallet();
    this.nullifyPhrase();
    ethWallet.getAddress = async () => address;
    ethWallet.sendTransaction = unsignedTx => {
      const txParam = unsignedTx;
      txParam.value = hexlify(BN.from(unsignedTx.value || 0));
      return metamaskClient
        .transferERC20(txParam)
        .then((hash: string) => ({hash}));
    };
    ethWallet.signTransaction = unsignedTx => {
      const txParam = unsignedTx;
      txParam.value = hexlify(BN.from(txParam.value || 0));

      return metamaskClient.signTransactionERC20(txParam);
    };

    this.client.getWallet = () => {
      return ethWallet;
    };

    this.client.transfer = async ({
      asset,
      memo,
      amount,
      recipient,
      feeOption,
      gasPrice,
      gasLimit,
    }) => {
      try {
        const txAmount = BN.from(amount.amount().toFixed());

        let assetAddress;
        if (asset && assetToString(asset) !== assetToString(AssetETH)) {
          assetAddress = getTokenAddress(asset);
        }

        const isETHAddress = assetAddress === ETHAddress;

        // feeOptionKey
        const defaultGasLimit: ethers.BigNumber = isETHAddress
          ? SIMPLE_GAS_COST
          : BASE_TOKEN_GAS_COST;

        let overrides: TxOverrides = {
          gasLimit: gasLimit || defaultGasLimit,
          gasPrice: gasPrice && BN.from(gasPrice.amount().toFixed()),
        };

        // override `overrides` if `feeOptionKey` is provided
        if (feeOption) {
          const gasPriceValue = await getGasPrice({
            client: this.client,
            feeOption,
          });
          const gasLimitValue = await this.client
            .estimateGasLimit({asset, recipient, amount, memo})
            .catch(() => defaultGasLimit);

          overrides = {
            gasLimit: gasLimitValue,
            gasPrice: BN.from(gasPriceValue),
          };
        }

        let txResult;
        if (assetAddress && !isETHAddress) {
          // Transfer ERC20
          const contract = new ethers.Contract(assetAddress, erc20ABI);
          const unsignedTx = await contract.populateTransaction.transfer(
            recipient,
            txAmount,
            {...overrides},
          );
          unsignedTx.from = address;

          txResult = await metamaskClient.transferERC20(unsignedTx);
        } else {
          // Transfer ETH
          const transactionRequest = {
            from: address,
            to: recipient,
            value: txAmount.toHexString(),
            ...overrides,
            data: memo ? toUtf8Bytes(memo) : undefined,
          };
          txResult = await metamaskClient.transferERC20(transactionRequest);
        }

        return txResult.hash || txResult;
      } catch (error) {
        return Promise.reject(error);
      }
    };

    this.client.call = async (props: EthCallParams) => {
      try {
        if (!props.contractAddress) {
          return await Promise.reject(new Error('address must be provided'));
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          props.contractAddress,
          props.abi,
          provider,
        ).connect(signer);
        return contract[props.funcName](...props.funcParams);
      } catch (error) {
        return Promise.reject(error);
      }
    };

    this.walletType = WalletOption.METAMASK;
  };

  connectXdefiWallet = async (xdefiClient: XdefiClient) => {
    if (!xdefiClient) throw Error('xdefi client not found');

    /**
     * 1. load chain provider
     * 2. patch getAddress method
     * 3. patch eth wallet object
     * 4. patch approve method
     * 5. patch transfer method
     * 6. patch call method
     */
    xdefiClient.loadProvider(ETHChain);

    const network = this.client.getNetwork();
    this.client = getETHClient(network, REACT_APP_MOCK_PHRASE);
    // NOTE: we need to do this to make sure we dont have valid wallet
    // because somehow feunds ended up in the mock wallet
    this.client.transfer = () => {
      // toast.error('wallet error, please reconnect');
      return new Promise(resolve => {
        resolve('wallet error, please reconnect');
      });
    };

    const address = await xdefiClient.getAddress(ETHChain);
    this.client.getAddress = () => address;

    // patch eth wallet
    const ethWallet = this.client.getWallet();
    this.nullifyPhrase();
    ethWallet.getAddress = async () => address;
    ethWallet.sendTransaction = unsignedTx => {
      const txParam = unsignedTx;
      txParam.value = hexlify(BN.from(unsignedTx.value || 0));
      return xdefiClient
        .transferERC20(txParam)
        .then((hash: string) => ({hash}));
    };
    ethWallet.signTransaction = unsignedTx => {
      const txParam = unsignedTx;
      txParam.value = hexlify(BN.from(txParam.value || 0));

      return xdefiClient.signTransactionERC20(txParam);
    };

    this.client.getWallet = () => {
      return ethWallet;
    };

    this.client.transfer = async ({
      asset,
      memo,
      amount,
      recipient,
      feeOption,
      gasPrice,
      gasLimit,
    }) => {
      try {
        const txAmount = BN.from(amount.amount().toFixed());

        let assetAddress;
        if (asset && assetToString(asset) !== assetToString(AssetETH)) {
          assetAddress = getTokenAddress(asset);
        }

        const isETHAddress = assetAddress === ETHAddress;

        // feeOptionKey
        const defaultGasLimit: ethers.BigNumber = isETHAddress
          ? SIMPLE_GAS_COST
          : BASE_TOKEN_GAS_COST;

        let overrides: TxOverrides = {
          gasLimit: gasLimit || defaultGasLimit,
          gasPrice: gasPrice && BN.from(gasPrice.amount().toFixed()),
        };

        // override `overrides` if `feeOptionKey` is provided
        if (feeOption) {
          const gasPriceValue = await getGasPrice({
            client: this.client,
            feeOption,
          });
          const gasLimitValue = await this.client
            .estimateGasLimit({asset, recipient, amount, memo})
            .catch(() => defaultGasLimit);

          overrides = {
            gasLimit: gasLimitValue,
            gasPrice: BN.from(gasPriceValue),
          };
        }

        let txResult;
        if (assetAddress && !isETHAddress) {
          // Transfer ERC20
          const contract = new ethers.Contract(assetAddress, erc20ABI);
          const unsignedTx = await contract.populateTransaction.transfer(
            recipient,
            txAmount.toHexString(),
            {...overrides},
          );
          unsignedTx.from = address;

          txResult = await xdefiClient.transferERC20(unsignedTx);
        } else {
          // Transfer ETH
          const transactionRequest = {
            from: address,
            to: recipient,
            value: txAmount.toHexString(),
            ...overrides,
            data: memo ? toUtf8Bytes(memo) : undefined,
          };
          txResult = await xdefiClient.transferERC20(transactionRequest);
        }

        return txResult.hash || txResult;
      } catch (error) {
        return Promise.reject(error);
      }
    };

    this.client.call = async (props: EthCallParams) => {
      try {
        if (!props.contractAddress) {
          return await Promise.reject(new Error('address must be provided'));
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          props.contractAddress,
          props.abi,
          provider,
        ).connect(signer);
        return contract[props.funcName](...props.funcParams);
      } catch (error) {
        return Promise.reject(error);
      }
    };

    this.walletType = WalletOption.XDEFI;
  };

  connectTrustWallet = async (walletconnectClient: WalletConnectClient) => {
    if (!walletconnectClient) throw Error('trustwallet client not found');

    const address = walletconnectClient.getAddressByChain(ETHChain);

    if (!address) throw Error('eth address not found');

    const network = this.client.getNetwork();
    this.client = getETHClient(network);
    // NOTE: we need to do this to make sure we dont have valid wallet
    // because somehow feunds ended up in the mock wallet
    this.client.transfer = () => {
      // toast.error('wallet error, please reconnect');
      return new Promise(resolve => {
        resolve('wallet error, please reconnect');
      });
    };

    // patch getAddress method with walletconnect address
    this.client.getAddress = () => address;

    const ethWallet = this.client.getWallet();
    this.nullifyPhrase();
    ethWallet.getAddress = async () => address;
    ethWallet.sendTransaction = unsignedTx => {
      const txParam = unsignedTx;
      txParam.value = hexlify(BN.from(unsignedTx.value || 0));

      return walletconnectClient
        .transferERC20(txParam)
        .then(({result}) => result);
    };

    ethWallet.signTransaction = unsignedTx => {
      const txParam = unsignedTx;
      txParam.value = hexlify(BN.from(txParam.value || 0));

      return walletconnectClient
        .signTransactionERC20(txParam)
        .then(({result}) => result);
    };

    this.client.getWallet = () => ethWallet;

    this.client.transfer = async ({
      asset,
      memo,
      amount,
      recipient,
      feeOption,
      gasPrice,
      gasLimit,
    }) => {
      try {
        const txAmount = BN.from(amount.amount().toFixed());

        let assetAddress;
        if (asset && assetToString(asset) !== assetToString(AssetETH)) {
          assetAddress = getTokenAddress(asset);
        }

        const isETHAddress = assetAddress === ETHAddress;

        // feeOptionKey
        const defaultGasLimit: ethers.BigNumber = isETHAddress
          ? SIMPLE_GAS_COST
          : BASE_TOKEN_GAS_COST;

        let overrides: TxOverrides = {
          gasLimit: gasLimit || defaultGasLimit,
          gasPrice: gasPrice && BN.from(gasPrice.amount().toFixed()),
        };

        // override `overrides` if `feeOptionKey` is provided
        if (feeOption) {
          const gasPriceValue = await getGasPrice({
            client: this.client,
            feeOption,
          });
          const gasLimitValue = await this.client
            .estimateGasLimit({asset, recipient, amount, memo})
            .catch(() => defaultGasLimit);

          overrides = {
            gasLimit: gasLimitValue,
            gasPrice: BN.from(gasPriceValue),
          };
        }

        let txResult;
        if (assetAddress && !isETHAddress) {
          // Transfer ERC20
          const contract = new ethers.Contract(assetAddress, erc20ABI);
          const unsignedTx = await contract.populateTransaction.transfer(
            recipient,
            txAmount.toHexString(),
            {...overrides},
          );
          unsignedTx.from = address;

          txResult = await walletconnectClient.transferERC20(unsignedTx);
        } else {
          // Transfer ETH
          const transactionRequest = {
            from: address,
            to: recipient,
            value: txAmount.toHexString(),
            ...overrides,
            data: memo ? toUtf8Bytes(memo) : undefined,
          };
          txResult = await walletconnectClient.transferERC20(
            transactionRequest,
          );
        }

        return txResult.hash || txResult;
      } catch (error) {
        return Promise.reject(error);
      }
    };

    this.client.call = async ({
      contractAddress,
      abi,
      funcName,
      funcParams,
    }: EthCallParams) => {
      try {
        if (!contractAddress) {
          return await Promise.reject(new Error('address must be provided'));
        }
        const walletconnectProvider = new WalletConnectProvider({
          infuraId: INFURA_PROJECT_ID,
        });
        await walletconnectProvider.enable();
        const provider = new ethers.providers.Web3Provider(
          walletconnectProvider,
        );
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          contractAddress,
          abi,
          provider,
        ).connect(signer);
        return contract[funcName](...funcParams);
      } catch (error) {
        return Promise.reject(error);
      }
    };

    this.walletType = WalletOption.TRUSTWALLET;
  };

  loadBalance = async (): Promise<AssetAmount[]> => {
    try {
      const address = this.client.getAddress();
      const provider = this.client.getProvider();
      const ethBalance = await provider.getBalance(address);

      let balances: Balance[] = await this.client.getBalance(
        this.client.getAddress(),
        this.client.getNetwork() === 'testnet' ? ETHAssets : undefined,
      );

      balances = balances.filter((balance: Balance) => balance.amount.gt(0));

      this.balances = await Promise.all(
        balances.map(async (data: Balance) => {
          const {asset, amount} = data;

          const assetObj = new Asset(asset.chain, asset.symbol);
          // set asset decimal
          await assetObj.setDecimal(amount.decimal);

          const amountObj = assetObj.isETH()
            ? new Amount(
                new BigNumber(ethBalance.toString()),
                AmountType.BASE_AMOUNT,
                assetObj.decimal,
              )
            : new Amount(
                amount.amount(),
                AmountType.BASE_AMOUNT,
                assetObj.decimal,
              );

          return new AssetAmount(assetObj, amountObj);
        }),
      );

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
        feeOption = FeeOption.Fast,
      } = tx;
      const {asset} = assetAmount;
      const amount = baseAmount(assetAmount.amount.baseAmount, asset.decimal);

      // estimate gas limit
      const defaultGasLimit: ethers.BigNumber = asset.isETH()
        ? SIMPLE_GAS_COST
        : BASE_TOKEN_GAS_COST;

      const gasLimit = await this.client
        .estimateGasLimit({asset, recipient, amount, memo})
        .catch(() => defaultGasLimit);

      const feeParam = feeRate
        ? {
            gasLimit,
            gasPrice: baseAmount(
              parseUnits(String(feeRate), 'gwei').toString(),
              ETH_DECIMAL,
            ),
          }
        : {feeOption};

      const txHash = await this.client.transfer({
        asset: asset.getAssetObj(),
        amount,
        recipient,
        memo,
        gasLimit,
        ...feeParam,
      });

      return txHash;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  deposit = async (params: DepositParams): Promise<TxHash> => {
    const {
      assetAmount,
      recipient,
      memo,
      feeRate,
      feeOption = FeeOption.Fast,
      router,
    } = params;

    const {asset} = assetAmount;

    // deposit base amount
    const amount = assetAmount.amount.baseAmount
      .integerValue(BigNumber.ROUND_DOWN)
      .toFixed();

    const checkSummedAddress = this.getCheckSumAddress(asset);

    // get gas amount based on the fee option
    const gasPrice = await getGasPrice({
      client: this.client,
      feeRate,
      feeOption,
      decimal: 0,
    });

    const contractParams = [
      recipient, // vault address
      checkSummedAddress, // asset checksum address
      amount, // deposit amount
      memo,
      asset.isETH()
        ? {
            from: this.client.getAddress(),
            value: amount,
            gasPrice,
          }
        : {gasPrice},
    ];

    if (!router) {
      throw Error('invalid router');
    }

    try {
      // walletIndex: number
      // contractAddress: string
      // abi: ethers.ContractInterface
      // funcName: string
      // funcParams: Array<any>
      const ethParams: EthCallParams = {
        walletIndex: 0,
        contractAddress: router,
        abi: TCRopstenAbi,
        funcName: 'deposit',
        funcParams: contractParams,
      };
      const res: any = await this.client.call(ethParams);

      return res?.hash ?? '';
    } catch (error: any) {
      if (error?.method === 'estimateGas')
        throw Error('Estimating gas failed. You may have not enough ETH.');
      else throw Error('You may have not enough ETH to submit the transaction');
    }
  };

  /**
   * @param param0 approve params
   * @returns approved status
   */
  isApproved = async ({
    contractAddress,
    spenderAddress,
  }: ApproveParams): Promise<boolean> => {
    return this.client.isApproved({
      contractAddress,
      spenderAddress,
      amount: baseAmount(1, ETH_DECIMAL),
    });
  };

  /**
   * @param param0 approve params
   * @returns approved status
   */
  approve = async ({
    contractAddress,
    spenderAddress,
    feeOption = FeeOption.Fast,
  }: ApproveParams): Promise<TxHash> => {
    const response = await this.client.approve({
      contractAddress,
      spenderAddress,
      feeOption,
    });

    return response.hash;
  };

  /**
   * get decimal for ERC20 token
   * @param asset ERC20 token
   * @returns decimal number
   */
  getERC20AssetDecimal = async (asset: Asset): Promise<number> => {
    if (asset.chain === 'ETH') {
      if (asset.symbol === 'ETH') {
        return ETH_DECIMAL;
      }

      const assetAddress = asset.symbol.slice(asset.ticker.length + 1);
      const strip0x = assetAddress.substr(2);
      const checkSummedAddress = ethers.utils.getAddress(strip0x);
      const tokenContract = new ethers.Contract(
        checkSummedAddress,
        erc20ABI,
        this.client.getWallet(),
      );
      const tokenDecimals = await tokenContract.decimals();

      return tokenDecimals.toNumber();
    }
    throw new Error('invalid eth chain');
  };

  getCheckSumAddress = (asset: Asset): string => {
    if (asset.isETH()) return ETHAddress;

    const assetAddress = getTokenAddress(asset.getAssetObj());

    if (assetAddress) {
      return ethers.utils.getAddress(assetAddress.toLowerCase());
    }

    throw new Error('invalid eth asset address');
  };
}
