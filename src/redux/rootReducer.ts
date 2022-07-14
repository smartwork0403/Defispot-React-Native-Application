import {combineReducers} from '@reduxjs/toolkit';

import {appReducer} from './app/app-slice';
import {reducer as midgardReducer} from './midgard/slice';
import {reducer as serverReducer} from './server/server.slice';
import {reducer as walletReducer} from './wallet/slice';

export default combineReducers({
  app: appReducer,
  midgard: midgardReducer,
  server: serverReducer,
  wallet: walletReducer,
});
