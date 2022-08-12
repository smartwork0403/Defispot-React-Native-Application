import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet, View} from 'react-native';
import {colors} from '../styles';

import CustomText from './CustomText';

import HomeSvg from '../assets/icons/navigation/home.svg';
import ChartSvg from '../assets/icons/navigation/chart-filled.svg';
import TradeSvg from '../assets/icons/navigation/trade.svg';
import WalletSvg from '../assets/icons/navigation/wallet.svg';
import UserSvg from '../assets/icons/navigation/user.svg';

import HomeScreen from '../screens/Home';
import MarketsScreen from '../screens/Markets';
import ProfileScreen from '../screens/Profile';
import TradeScreen from '../screens/Trade';
import WalletScreen from '../screens/Wallet';
import NotificationsScreen from '../screens/Notifications';
import AssetScreen from '../screens/Asset';
import HistoryScreen from '../screens/History';
import ImportCreateWalletScreen from '../screens/ImportCreateWallet';
import SignInEmailScreen from '../screens/SignInEmail';
import WelcomeScreen from '../screens/Welcome';
import GetStartedScreen from '../screens/GetStarted';

export type RootStackParamList = {
  Home: undefined;
  Asset: undefined;
  History: undefined;
  ImportCreateWallet: undefined;
  SignInEmail: undefined;
  Welcome: undefined;
  GetStarted: undefined;
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
    label: 'Home',
    component: HomeScreenStack,
    icon: HomeSvg,
  },
  {
    name: 'markets',
    label: 'Markets',
    component: MarketsScreen,
    icon: ChartSvg,
  },
  {
    name: 'trade',
    label: 'Trade',
    component: TradeScreen,
    icon: TradeSvg,
  },
  {
    name: 'wallet',
    label: 'Wallet',
    component: WalletScreen,
    icon: WalletSvg,
  },
  {
    name: 'profile',
    label: 'Profile',
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
                  <CustomText
                    style={{
                      ...styles.navLabel,
                      color: focused ? colors.blue : colors.neutral400,
                    }}
                    weight="medium">
                    {nav.label}
                  </CustomText>
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
      <RootStack.Screen name="Welcome" component={WelcomeScreen} />
      <RootStack.Screen name="GetStarted" component={GetStartedScreen} />
      <RootStack.Screen
        name="ImportCreateWallet"
        component={ImportCreateWalletScreen}
      />
      <RootStack.Screen name="SignInEmail" component={SignInEmailScreen} />

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
    paddingLeft: 15,
    paddingRight: 15,
    height: 56 + 13,
    paddingBottom: 13,
  },
  nav: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },
  navLabel: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 16,
  },
});

export default Navigation;
