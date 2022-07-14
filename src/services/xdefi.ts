import {config} from '../settings/config';

import {XdefiClient} from '../SDKs/xdefi-sdk';

const xdefi = new XdefiClient(config.network);

export {xdefi};
