import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';
import {colors} from '../styles';

import HomeSvg from '../assets/icons/home.svg';
import PieSvg from '../assets/icons/pie-chart.svg';
import SwapSvg from '../assets/icons/swap.svg';
import WalletSvg from '../assets/icons/wallet.svg';
import UserSvg from '../assets/icons/user.svg';

import HomeScreen from '../screens/Home';
import MarketsScreen from '../screens/Markets';
import ProfileScreen from '../screens/Profile';
import TradeScreen from '../screens/Trade';
import WalletScreen from '../screens/Wallet';
import NotificationsScreen from '../screens/Notifications';
import AssetScreen from '../screens/Asset';
import HistoryScreen from '../screens/History';
import { useAppSetup } from '../hooks/useAppSetup';
import { useGlobalRefresh } from '../hooks/useGlobalRefresh';

export type RootStackParamList = {
  Home: undefined;
  Asset: undefined;
  History: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Notifications: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const RootTabNavigator = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const HomeScreenStack = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
    </HomeStack.Navigator>
  );
};

const navItems = [
  {
    name: 'home',
    component: HomeScreenStack,
    icon: HomeSvg,
  },
  {
    name: 'markets',
    component: MarketsScreen,
    icon: PieSvg,
  },
  {
    name: 'trade',
    component: TradeScreen,
    icon: SwapSvg,
  },
  {
    name: 'wallet',
    component: WalletScreen,
    icon: WalletSvg,
  },
  {
    name: 'profile',
    component: ProfileScreen,
    icon: UserSvg,
  },
];

const MainTabs = () => {
  return (
    <RootTabNavigator.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.container,
      }}>
      {navItems.map(nav => {
        return (
          <RootTabNavigator.Screen
            key={nav.name}
            name={nav.name}
            component={nav.component}
            options={{
              tabBarIcon: ({focused}) => (
                <View style={styles.nav}>
                  <nav.icon
                    width={20}
                    height={20}
                    color={focused ? colors.blue : colors.neutral400}
                  />
                </View>
              ),
            }}
          />
        );
      })}
    </RootTabNavigator.Navigator>
  );
};

const Navigation: React.FC = () => {
  useAppSetup();
  useGlobalRefresh();
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'simple_push',
      }}>
      <RootStack.Screen name="Home" component={MainTabs} />
      <RootStack.Screen name="Asset" component={AssetScreen} />
      <RootStack.Screen name="History" component={HistoryScreen} />
    </RootStack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 0,
    borderColor: colors.neutral0,
    backgroundColor: colors.neutral0,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 32,
    paddingRight: 32,
  },
  nav: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
});

export default Navigation;
