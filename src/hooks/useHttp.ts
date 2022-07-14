import {useCallback} from 'react';

import globalAxios, {AxiosInstance} from 'axios';

import {
  MIDGARD_CHAOSNET_URL,
  MIDGARD_CHAOSNET_URL_FALLBACK,
} from '../SDKs/midgard-sdk/config';

import {httpClientV2} from '../helpers/http-client.helper';

export const useHttp = () => {
  const getHttpClientV2 = useCallback(() => httpClientV2, []);
  const getMidgardClient = useCallback(() => globalAxios, []);

  const responseInterceptor = useCallback((httpInstance: AxiosInstance) => {
    return httpInstance.interceptors.response.use(
      async response => response,
      error => {
        if (error.status === 503) {
          console.log('503 error');
        }
        // TODO: Handle global exceptions here.
        return Promise.reject(error);
      },
    );
  }, []);

  const midgardResponseInterceptor = useCallback(
    (httpInstance: AxiosInstance) => {
      return httpInstance.interceptors.response.use(
        async response => {
          return response;
        },
        error => {
          if (error.config.url.indexOf(MIDGARD_CHAOSNET_URL) > -1) {
            if (MIDGARD_CHAOSNET_URL === MIDGARD_CHAOSNET_URL_FALLBACK) {
              return Promise.reject(error);
            }
            error.config.url = error.config.url.replace(
              MIDGARD_CHAOSNET_URL,
              MIDGARD_CHAOSNET_URL_FALLBACK,
            );
            return globalAxios.request(error.config);
          }
          return Promise.reject(error);
        },
      );
    },
    [],
  );

  return {
    getHttpClientV2,
    responseInterceptor,
    midgardResponseInterceptor,
    getMidgardClient,
  };
};
