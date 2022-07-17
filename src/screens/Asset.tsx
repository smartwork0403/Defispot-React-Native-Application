import React from 'react';
import AssetHeader from '../components/AssetHeader';

import Layout from '../components/Layout';

const AssetScreen: React.FC = () => {
  return (
    <Layout contentStyle={{padding: 0}}>
      <AssetHeader />
    </Layout>
  );
};

export default AssetScreen;
