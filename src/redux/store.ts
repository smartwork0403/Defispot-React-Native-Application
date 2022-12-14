import {configureStore} from '@reduxjs/toolkit';

import {initApp} from './initApp';
import {middleware} from './middleware';
import rootReducer from './rootReducer';
import {NODE_ENV} from '@env';

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
    ...middleware,
  ],
  devTools: NODE_ENV !== 'production',
});

initApp(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
