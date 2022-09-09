import {useEffect} from 'react';
import {useApp} from '../redux/app/hooks';

import type {Asset} from '../components/AssetsList';

export const ASSETS_STATE = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error',
};

export const useAssets = () => {
  const {assetsList, setAssetsList} = useApp();

  useEffect(() => {
    const getData = async () => {
      try {
        setAssetsList({state: ASSETS_STATE.loading, data: []});

        console.log('begin fetch data');

        const resSet1 = await fetch(
          'https://fi40rvt5l0.execute-api.us-east-1.amazonaws.com/test/api/v2/assets/info',
        );
        const dataSet1 = await resSet1.json();
        console.log('end data one');

        const resSet2 = await fetch(
          'https://api.rango.exchange/meta?apiKey=57e66bdb-07ae-4956-a117-7570276a02d6',
        );
        const dataSet2 = await resSet2.json();
        console.log('end data two');

        const assetsImageMap = new Map();
        dataSet2.tokens.forEach(token => {
          assetsImageMap.set(token.symbol, token.image);
        });

        console.log('finish loading data');

        const data: Asset[] = [];

        dataSet1.forEach(asset => {
          data.push({
            cmcId: asset.cmcId,
            asset_full_name: asset.asset_full_name,
            symbol: asset.symbol,
            chain: asset.chain,
            chain_full_name: asset.chain_full_name,
            token_address: asset.token_address,
            image: assetsImageMap.get(asset.symbol),
            market_cap: asset.market_cap,
            percent_change_24h: asset.percent_change_24h,
            percent_change_7d: asset.percent_change_7d,
            price: asset.price,
            volume_24h: asset.volume_24h,
            volume_change_24h: asset.volume_change_24h,
          });
        });

        setAssetsList({state: ASSETS_STATE.success, data});
      } catch (e) {
        console.log('Error while fetching data in useAssets hook', e);
        setAssetsList({state: ASSETS_STATE.error, data: []});
      }
    };

    if (
      assetsList.state === ASSETS_STATE.idle &&
      assetsList.data.length === 0
    ) {
      getData();
    }
  }, []);
};
