import {AssetETH, Asset, Chain} from '@xchainjs/xchain-util';

// toxic tether https://ropsten.etherscan.io/token/0xa3910454bf2cb59b8b3a401589a3bacc5ca42306
export const AssetUSDTERC20: Asset = {
  chain: Chain.Ethereum,
  symbol: 'USDT-0xa3910454bf2cb59b8b3a401589a3bacc5ca42306',
  ticker: 'USDT',
  synth: false,
};

export const AssetRuneEthERC20: Asset = {
  chain: Chain.Ethereum,
  symbol: 'RUNE-0xd601c6A3a36721320573885A8d8420746dA3d7A0',
  ticker: 'RUNE',
  synth: false,
};

// ETH.THOR - for testnet only
export const AssetMarsERC20: Asset = {
  chain: Chain.Ethereum,
  symbol: 'MARS-0x9465dc5a988957cb56be398d1f05a66f65170361',
  ticker: 'MARS',
  synth: false,
};

export const AssetWETHERC20: Asset = {
  chain: Chain.Ethereum,
  symbol: 'WETH-0xbCA556c912754Bc8E7D4Aad20Ad69a1B1444F42d',
  ticker: 'WETH',
  synth: false,
};

export const AssetDAIERC20: Asset = {
  chain: Chain.Ethereum,
  symbol: 'DAI-0XAD6D458402F60FD3BD25163575031ACDCE07538D',
  ticker: 'DAI',
  synth: false,
};

export const AssetXRUNEERC20: Asset = {
  chain: Chain.Ethereum,
  symbol: 'XRUNE-0x8626DB1a4f9f3e1002EEB9a4f3c6d391436Ffc23',
  ticker: 'XRUNE',
  synth: false,
};

// This hardcode list is for testnet only
export const ERC20Assets = [
  AssetMarsERC20,
  AssetUSDTERC20,
  AssetDAIERC20,
  AssetXRUNEERC20,
];

export const ETHAssets = [AssetETH, ...ERC20Assets];
