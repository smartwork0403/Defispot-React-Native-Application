import React from 'react';
import {SafeAreaView, ScrollView, Text} from 'react-native';

import Header from '../components/Header';

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <Header title="Home" minimal />
        <Text>Home screen</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
