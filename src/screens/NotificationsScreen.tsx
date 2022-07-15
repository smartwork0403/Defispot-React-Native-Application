import React from 'react';
import {SafeAreaView, ScrollView, Text} from 'react-native';

import Header from '../components/Header';

import SettingsSvg from '../assets/icons/settings.svg';

const NotificationsScreen: React.FC = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <Header
          title="Notifications"
          minimal
          action={{type: 'icon', icon: SettingsSvg}}
          back={{onPressBack: () => {}}}
        />
        <Text>Home screen</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
