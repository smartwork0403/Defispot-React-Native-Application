export const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;
export const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID || '';

export const NETWORK_TYPE = process.env.REACT_APP_NETWORK || 'mainnet';

export const ETHPLORER_API_KEY = process.env.REACT_APP_ETHPLORER_API_KEY;
export const ADDRESS = process.env.REACT_APP_ADDRESS;

const AFFILIATE: number = parseFloat(process.env.REACT_APP_AFFILIATE_FEE || '');
export const AFFILIATE_FEE: number =
  AFFILIATE > 0 && AFFILIATE <= 0.1 ? AFFILIATE : 0;
