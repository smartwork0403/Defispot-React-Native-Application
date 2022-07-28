import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';

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

const RootStack = createNativeStackNavigator();
const RootTabNavigator = createBottomTabNavigator();
const RestaurantsStack = createNativeStackNavigator();

const HomeScreenStack = () => {
  return (
    <RestaurantsStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <RestaurantsStack.Screen name="Home" component={HomeScreen} />
      <RestaurantsStack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
    </RestaurantsStack.Navigator>
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
                    color={focused ? '#0077FF' : '#A1A1A8'}
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
    borderColor: '#fff',
    backgroundColor: '#fff',
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
