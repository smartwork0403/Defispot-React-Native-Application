import {ledger, crypto} from '@binance-chain/javascript-sdk';

import {LEDGER_CONNECT_TIMEOUT} from '../constants';

export const BINANCE_DERIVATION_PATH = [44, 714, 0, 0, 0];
export type BinancePrefix = 'bnb' | 'tbnb';

export class BinanceLedger {
  private prefix: BinancePrefix;

  private ledgerApp: any;

  public derivationPath: number[] = BINANCE_DERIVATION_PATH;

  constructor(network = 'mainnet', addressIndex = 0) {
    // enable ledger for only mainnet
    this.prefix = this.getPrefix(network);

    this.derivationPath[4] = addressIndex;
  }

  getPrefix = (network: string) => {
    return network === 'testnet' ? 'tbnb' : 'bnb';
  };

  connect = async (): Promise<string> => {
    const transport = await ledger.transports.u2f.create(
      LEDGER_CONNECT_TIMEOUT,
    );

    // eslint-disable-next-line new-cap
    const app = new ledger.app(transport, 100000, 100000);

    this.setLedgerApp(app);

    const {pk} = await app.getPublicKey(this.derivationPath);

    const address = crypto.getAddressFromPublicKey(pk, this.prefix);

    // confirm address from ledger
    await app.showAddress(this.prefix, this.derivationPath);

    return address;
  };

  setLedgerApp = (app: any) => {
    this.ledgerApp = app;
  };

  getLedgerApp = () => {
    return this.ledgerApp;
  };
}
