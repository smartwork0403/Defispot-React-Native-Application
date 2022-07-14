import {Keystore} from '@xchainjs/xchain-crypto';
import {Asset} from '../SDKs/multichain-sdk';

const DEFISPOT_ANNOUNCEMENT = 'DEFISPOT_ANNOUNCEMENT';

const DEFISPOT_MULTICHAIN_KEYSTORE = 'DEFISPOT_MULTICHAIN_KEYSTORE';
const DEFISPOT_MULTICHAIN_ADDR = 'DEFISPOT_MULTICHAIN_ADDR';
const DEFISPOT_XDEFI_STATUS = 'DEFISPOT_XDEFI_STATUS';
const REFERRING_AFFILIATE_CODE = 'REFERRING_AFFILIATE_CODE';

const BASE_CURRENCY = 'BASE_CURRENCY';

export const saveBaseCurrency = (currency: string) => {
  localStorage.setItem(BASE_CURRENCY, currency);
};

export const getBaseCurrency = (): string => {
  return (
    (localStorage.getItem(BASE_CURRENCY) as string) || Asset.USD().toString()
  );
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

// save xdefi status to localstorage
export const saveXdefiConnected = (connected: boolean) => {
  if (connected) {
    localStorage.setItem(DEFISPOT_XDEFI_STATUS, 'connected');
  } else {
    localStorage.removeItem(DEFISPOT_XDEFI_STATUS);
  }
};

export const getXdefiConnected = (): boolean => {
  return localStorage.getItem(DEFISPOT_XDEFI_STATUS) === 'connected';
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
  localStorage.setItem(DEFISPOT_ANNOUNCEMENT, read.toString());
};

export const getReadStatus = (): boolean => {
  const read = localStorage.getItem(DEFISPOT_ANNOUNCEMENT) === 'true';
  return read;
};

export const setReferringAffiliateCode = async (affiliateCode: string) => {
  const referralCode = getReferringAffiliateCode();
  if (!referralCode) {
    localStorage.setItem(REFERRING_AFFILIATE_CODE, affiliateCode);
  }
};

export const getReferringAffiliateCode = (): string | null => {
  const referralCode = localStorage.getItem(REFERRING_AFFILIATE_CODE);
  return referralCode;
};
