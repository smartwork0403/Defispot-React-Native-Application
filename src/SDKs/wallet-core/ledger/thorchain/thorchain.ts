import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import {fromByteArray} from 'base64-js';

import THORChainApp from './lib';
import {ERROR_CODE} from './lib/common';
import {GetAddressAndPubKeyResponse, Signature} from './types';
import {getSignature} from './utils';

export const THORCHAIN_DERIVATION_PATH = [44, 931, 0, 0, 0];
export type THORChainPrefix = 'thor' | 'tthor';

export class THORChainLedger {
  private prefix: THORChainPrefix;

  private pubKey: string | null = null;

  private ledgerApp: THORChainApp | undefined;

  public derivationPath: number[] = THORCHAIN_DERIVATION_PATH;

  constructor(network = 'mainnet', addressIndex = 0) {
    this.prefix = this.getPrefix(network);
    this.derivationPath[4] = addressIndex;
  }

  getPrefix = (network: string) => {
    return network === 'testnet' ? 'tthor' : 'thor';
  };

  setLedgerApp = (app: THORChainApp) => {
    this.ledgerApp = app;
  };

  getLedgerApp = () => {
    return this.ledgerApp;
  };

  initApp = async (): Promise<THORChainApp> => {
    const transport = await TransportWebUSB.create();

    const app = new THORChainApp(transport);
    this.setLedgerApp(app);

    return app;
  };

  getAddressAndPubKey = async (): Promise<GetAddressAndPubKeyResponse> => {
    if (!this.ledgerApp) throw Error('ledger not connected');

    const response: GetAddressAndPubKeyResponse =
      await this.ledgerApp.getAddressAndPubKey(
        this.derivationPath,
        this.prefix,
      );

    if (response.return_code !== ERROR_CODE.NoError) {
      throw Error(`${response.return_code}] ${response.error_message}`);
    }

    return response;
  };

  showAddressAndPubKey = async (): Promise<GetAddressAndPubKeyResponse> => {
    if (!this.ledgerApp) throw Error('ledger not connected');

    const response: GetAddressAndPubKeyResponse =
      await this.ledgerApp.showAddressAndPubKey(
        this.derivationPath,
        this.prefix,
      );

    if (response.return_code !== ERROR_CODE.NoError) {
      throw Error(`${response.return_code}] ${response.error_message}`);
    }

    return response;
  };

  connect = async (): Promise<string> => {
    await this.initApp();

    const response: GetAddressAndPubKeyResponse =
      await this.getAddressAndPubKey();

    this.pubKey = fromByteArray(response.compressed_pk);

    return response.bech32_address;
  };

  signTransaction = async (rawTx: string): Promise<Signature[]> => {
    if (!this.ledgerApp) {
      await this.initApp();
    }

    if (!this.pubKey) throw Error('Public Key not found');

    const response = await this.ledgerApp?.sign(this.derivationPath, rawTx);

    if (response.return_code !== ERROR_CODE.NoError) {
      throw Error(`${response.return_code}] ${response.error_message}`);
    }

    const signatureArray = response.signature;

    const signatureBase64 = getSignature(signatureArray);

    const signature = {
      pub_key: {
        type: 'tendermint/PubKeySecp256k1',
        value: this.pubKey,
      },
      signature: signatureBase64,
    };

    return [signature];
  };
}
