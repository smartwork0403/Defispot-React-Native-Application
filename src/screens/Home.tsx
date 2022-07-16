import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'react-native';

import Layout from '../components/Layout';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <Layout
      header={{
        title: 'Home',
        minimal: true,
        action: {
          type: 'text',
          text: 'Notifications',
          onActionPress: () => navigation.navigate('Notifications'),
        },
      }}>
      <Text>Home screen</Text>
    </Layout>
  );
};

export default HomeScreen;
