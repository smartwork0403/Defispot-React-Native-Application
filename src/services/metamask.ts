import {config} from '../settings/config';

import {MetaMaskClient} from '../SDKs/metamask-sdk';

const metamask = new MetaMaskClient(config.network);

export {metamask};
