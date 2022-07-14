import {Midgard} from '../SDKs/midgard-sdk';

import {config} from '../settings/config';

export const midgardApi = new Midgard(config.network);
