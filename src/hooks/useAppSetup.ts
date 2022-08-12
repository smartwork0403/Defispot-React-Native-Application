import {useEffect} from 'react';

import {useHttp} from './useHttp';

export const useAppSetup = () => {
  const {
    getHttpClientV2,
    getMidgardClient,
    responseInterceptor,
    midgardResponseInterceptor,
  } = useHttp();

  useEffect(() => {
    const httpV2Instance = getHttpClientV2();
    const response = responseInterceptor(httpV2Instance);
    return () => {
      httpV2Instance.interceptors.response.eject(response);
    };
  }, [getHttpClientV2, responseInterceptor]);

  useEffect(() => {
    const midgardInstance = getMidgardClient();
    const response = midgardResponseInterceptor(midgardInstance);
    return () => {
      midgardInstance.interceptors.response.eject(response);
    };
  }, [getHttpClientV2, getMidgardClient, midgardResponseInterceptor]);
};
