import {useEffect, useState} from 'react';

import {Asset} from '../SDKs/multichain-sdk';

export const useAssetParams = (assetParam = '') => {
  const [asset, setAsset] = useState<Asset>();

  useEffect(() => {
    const getAssetEntity = async () => {
      if (!assetParam) {
        return;
      }
      const assetEntity = Asset.decodeFromURL(assetParam);

      if (assetEntity) {
        if (assetEntity.isRUNE()) {
          return;
        }

        await assetEntity.setDecimal();

        setAsset(assetEntity);
      }
    };

    getAssetEntity();
  }, [assetParam]);

  return asset;
};
