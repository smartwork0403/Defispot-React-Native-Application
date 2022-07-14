import axios, {AxiosRequestConfig, AxiosInstance} from 'axios';

import {config} from '../settings/config';

const appConfigV2: AxiosRequestConfig = {
  baseURL: config.apiV2Url,
};

export const httpClientV2: AxiosInstance = axios.create(appConfigV2);
