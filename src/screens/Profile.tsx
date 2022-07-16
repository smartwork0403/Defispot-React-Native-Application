import React from 'react';
import {Text} from 'react-native';

import Layout from '../components/Layout';

const ProfileScreen: React.FC = () => {
  return (
    <Layout
      header={{
        title: 'Profile',
        minimal: true,
      }}>
      <Text>profile screen</Text>
    </Layout>
  );
};

export default ProfileScreen;
