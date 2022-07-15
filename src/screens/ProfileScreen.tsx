import React from 'react';
import {SafeAreaView, ScrollView, Text} from 'react-native';

import Header from '../components/Header';

const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <Header title="Profile" minimal />
        <Text>profile screen</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
