import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, View} from 'react-native';

import HomeSvg from '../assets/icons/home.svg';
import PieSvg from '../assets/icons/pie-chart.svg';
import SwapSvg from '../assets/icons/swap.svg';
import WalletSvg from '../assets/icons/wallet.svg';
import UserSvg from '../assets/icons/user.svg';

import HomeScreen from '../screens/HomeScreen';
import MarketsScreen from '../screens/MarketsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TradeScreen from '../screens/TradeScreen';
import WalletScreen from '../screens/WalletScreen';

const Tab = createBottomTabNavigator();
const navItems = [
  {
    name: 'home',
    component: HomeScreen,
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

const Navigation: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.container,
        unmountOnBlur: false,
      }}>
      {navItems.map(nav => {
        return (
          <Tab.Screen
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
    </Tab.Navigator>
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
