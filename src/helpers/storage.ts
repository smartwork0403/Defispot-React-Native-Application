import {Keystore} from '@xchainjs/xchain-crypto';
import {Asset} from '../SDKs/multichain-sdk';

import {AsyncStorage} from 'react-native';

const DEFISPOT_ANNOUNCEMENT = 'DEFISPOT_ANNOUNCEMENT';

const DEFISPOT_MULTICHAIN_KEYSTORE = 'DEFISPOT_MULTICHAIN_KEYSTORE';
const DEFISPOT_MULTICHAIN_ADDR = 'DEFISPOT_MULTICHAIN_ADDR';
const DEFISPOT_XDEFI_STATUS = 'DEFISPOT_XDEFI_STATUS';
const REFERRING_AFFILIATE_CODE = 'REFERRING_AFFILIATE_CODE';

const BASE_CURRENCY = 'BASE_CURRENCY';

export const saveBaseCurrency = (currency: string) => {
  AsyncStorage.setItem(BASE_CURRENCY, currency);
};

export const getBaseCurrency = (): string => {
  let base = AsyncStorage.getItem(BASE_CURRENCY);
  console.log(base, 'Asetetetete');
  return Asset.USD().toString();
};

export const saveKeystore = (keystore: Keystore) => {
  sessionStorage.setItem(
    DEFISPOT_MULTICHAIN_KEYSTORE,
    JSON.stringify(keystore),
  );
};

export const getKeystore = (): Keystore | null => {
  const item = sessionStorage.getItem(DEFISPOT_MULTICHAIN_KEYSTORE);

  if (item) {
    return JSON.parse(item) as Keystore;
  }

  return null;
};

// save xdefi status to AsyncStorage
export const saveXdefiConnected = (connected: boolean) => {
  if (connected) {
    AsyncStorage.setItem(DEFISPOT_XDEFI_STATUS, 'connected');
  } else {
    AsyncStorage.removeItem(DEFISPOT_XDEFI_STATUS);
  }
};

export const getXdefiConnected = async (): Promise<boolean> => {
  let status = await AsyncStorage.getItem(DEFISPOT_XDEFI_STATUS);
  return status === 'connected';
};

export const saveAddress = (address: string) => {
  sessionStorage.setItem(DEFISPOT_MULTICHAIN_ADDR, address);
};

export const getAddress = (): string | null => {
  const item = sessionStorage.getItem(DEFISPOT_MULTICHAIN_ADDR);

  if (item) {
    return item;
  }
  return null;
};

export const setReadStatus = (read: boolean) => {
  AsyncStorage.setItem(DEFISPOT_ANNOUNCEMENT, read.toString());
};

export const getReadStatus = async (): Promise<boolean> => {
  const read = (await AsyncStorage.getItem(DEFISPOT_ANNOUNCEMENT)) === 'true';
  return read;
};

export const setReferringAffiliateCode = async (affiliateCode: string) => {
  const referralCode = getReferringAffiliateCode();
  if (!referralCode) {
    AsyncStorage.setItem(REFERRING_AFFILIATE_CODE, affiliateCode);
  }
};

export const getReferringAffiliateCode = async (): Promise<string | null> => {
  const referralCode = await AsyncStorage.getItem(REFERRING_AFFILIATE_CODE);
  return referralCode;
};
