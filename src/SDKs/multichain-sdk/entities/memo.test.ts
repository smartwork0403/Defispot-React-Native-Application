import {Network} from '@thorwallet/xchain-client';
import {Chain} from '@thorwallet/xchain-util';

import {Amount, AmountType, Asset, Memo} from '.';

describe('checkAffiliate', () => {
  it('fourth affiliate', () => {
    const arr = [
      'thor1uj0v03uhaxm7judgea2lj8tcwx2x8rz4g7pytm',
      'thor2uj0v03uhaxm7judgea2lj8tcwx2x8rz4g7pytm',
      'third affiliate',
      'fourth affiliate',
    ];
    const result = Memo.checkAffiliate(arr, 'mainnet', 0.4096);
    expect(result).toEqual('fourth affiliate');
  });
  it('second affiliate', () => {
    const arr = [
      'thor1uj0v03uhaxm7judgea2lj8tcwx2x8rz4g7pytm',
      'thor2uj0v03uhaxm7judgea2lj8tcwx2x8rz4g7pytm',
      'third affiliate',
      'fourth affiliate',
    ];
    const result = Memo.checkAffiliate(arr, 'mainnet', 0.65);
    expect(result).toEqual('thor2uj0v03uhaxm7judgea2lj8tcwx2x8rz4g7pytm');
  });
  it('first affiliate', () => {
    const arr = [
      'thor1uj0v03uhaxm7judgea2lj8tcwx2x8rz4g7pytm',
      'thor2uj0v03uhaxm7judgea2lj8tcwx2x8rz4g7pytm',
    ];
    const result = Memo.checkAffiliate(arr, 'mainnet', 0.81);
    expect(result).toEqual('thor1uj0v03uhaxm7judgea2lj8tcwx2x8rz4g7pytm');
  });
  it('default address', () => {
    const arr = [
      'thor1uj0v03uhaxm7judgea2lj8tcwx2x8rz4g7pytm',
      'thor2uj0v03uhaxm7judgea2lj8tcwx2x8rz4g7pytm',
    ];
    const result = Memo.checkAffiliate(arr, 'mainnet', 1);
    expect(result).toEqual('thor1ygue0vwzlcuydw0s40t3mf7kjsvlcsr2f3lx0j');
  });
  it('default address2', () => {
    const arr: string[] = [];
    const result = Memo.checkAffiliate(arr, 'mainnet', 0.8);
    expect(result).toEqual('thor1ygue0vwzlcuydw0s40t3mf7kjsvlcsr2f3lx0j');
  });
  it('default address3', () => {
    const arr: string[] = [];
    const result = Memo.checkAffiliate(arr, 'mainnet', 0.1);
    expect(result).toEqual('thor1ygue0vwzlcuydw0s40t3mf7kjsvlcsr2f3lx0j');
  });
  it('testnet', () => {
    const arr: string[] = [];
    const result = Memo.checkAffiliate(arr, 'testnet', 0.1);
    expect(result).toEqual('tthor1ygue0vwzlcuydw0s40t3mf7kjsvlcsr2dxwkkh');
  });
  it('swapMemo with BTC', () => {
    const result = Memo.swapMemo(
      new Asset(Chain.THORChain, 'RUNE'),
      'tthor1ygue0vwzlcuydw0s40t3mf7kjsvlcsr2dxwkkh',
      new Amount('555555', AmountType.ASSET_AMOUNT, 0),
      Network.Mainnet,
      new Asset(Chain.Bitcoin, 'BTC'),
    );
    expect(result).toEqual(
      '=:THOR.RUNE:tthor1ygue0vwzlcuydw0s40t3mf7kjsvlcsr2dxwkkh:55555500000012',
    );
  });
  it('swapMemo with ETH', () => {
    const result = Memo.swapMemo(
      new Asset(Chain.THORChain, 'RUNE'),
      'tthor1ygue0vwzlcuydw0s40t3mf7kjsvlcsr2dxwkkh',
      new Amount('555555', AmountType.ASSET_AMOUNT, 0),
      Network.Mainnet,
      new Asset(Chain.Ethereum, 'ETH'),
    );
    expect(result).toEqual(
      '=:THOR.RUNE:tthor1ygue0vwzlcuydw0s40t3mf7kjsvlcsr2dxwkkh:55555500000012:thor1ygue0vwzlcuydw0s40t3mf7kjsvlcsr2f3lx0j:50',
    );
  });
});
