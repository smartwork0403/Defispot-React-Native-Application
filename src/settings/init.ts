/* eslint-disable no-console */
import {NODE_ENV} from '@env';

export const appInit = () => {
  // disable console log for production
  const noop = () => {};
  if (NODE_ENV === 'production') {
    console.log = noop;
    console.warn = noop;
    console.error = noop;
  }
};
