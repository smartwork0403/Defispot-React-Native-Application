import {MultiChain} from '../SDKs/multichain-sdk';

import {config} from '../settings/config';

const multichain = new MultiChain({
  network: config.network,
});

export {multichain};
