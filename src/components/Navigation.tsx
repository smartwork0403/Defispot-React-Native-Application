import React from 'react';
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  StackScreenProps,
} from '@react-navigation/native-stack';
import type {CompositeScreenProps} from '@react-navigation/native';
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
import WalletScreen from '../screens/Wallet';
import NotificationsScreen from '../screens/Notifications';
import AssetScreen from '../screens/Asset';
import HistoryScreen from '../screens/History';
import ImportCreateWalletScreen from '../screens/ImportCreateWallet';
import SignInEmailScreen from '../screens/SignInEmail';
import WelcomeScreen from '../screens/Welcome';
import GetStartedScreen from '../screens/GetStarted';
import ConnectWalletScreen from '../screens/ConnectWallet';
import ExportPrivateKeyScreen from '../screens/ExportPrivateKey';
import TermsOfServiceScreen from '../screens/TermsOfService';
import NotificationsSettingsScreen from '../screens/NotificationsSettings';
import SecurityAlertsScreen from '../screens/SecurityAlerts';
import AccountActivityScreen from '../screens/AccountActivity';
import PriceAlertsScreen from '../screens/PriceAlerts';
import ProductAnnouncementsScreen from '../screens/ProductAnnouncements';
import DepositScreen from '../screens/Deposit';
import WithdrawScreen from '../screens/Withdraw';
import SwapScreen from '../screens/Swap';
import DepositWithNetworkScreen from '../screens/DepositWithNetwork';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppSetup} from '../hooks/useAppSetup';
import {useGlobalRefresh} from '../hooks/useGlobalRefresh';

export const importCreateWalletParamsList = {
  IMPORT: 'import',
  CREATE: 'create',
};

export type RootStackParamList = {
  Home: undefined;
  Asset: undefined;
  History: undefined;
  ImportCreateWallet: {type: 'import' | 'create'};
  SignInEmail: undefined;
  Welcome: undefined;
  GetStarted: undefined;
  ConnectWallet: undefined;
  ExportPrivateKey: undefined;
  NotificationsSettings: undefined;
  SecurityAlerts: undefined;
  AccountActivity: undefined;
  PriceAlerts: undefined;
  ProductAnnouncements: undefined;
  DepositWithNetwork: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type ImportCreateWalletScreenProps<T extends keyof RootStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type HomeStackParamList = {
  Home: undefined;
  Notifications: undefined;
};

export type TradeStackParamList = {
  Deposit: undefined;
  Swap: undefined;
  Withdraw: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  TermsOfService: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const RootTabNavigator = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const TradeStack = createNativeStackNavigator<TradeStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

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

const TradeScreenStack = () => {
  return (
    <TradeStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}>
      <TradeStack.Screen name="Deposit" component={DepositScreen} />
      <TradeStack.Screen name="Swap" component={SwapScreen} />
      <TradeStack.Screen name="Withdraw" component={WithdrawScreen} />
    </TradeStack.Navigator>
  );
};

const ProfileScreenStack = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
      />
    </ProfileStack.Navigator>
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
    component: TradeScreenStack,
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
    component: ProfileScreenStack,
    icon: UserSvg,
  },
];

const MainTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <RootTabNavigator.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          elevation: 0,
          borderColor: colors.neutral0,
          backgroundColor: colors.neutral0,
          paddingLeft: 15,
          paddingRight: 15,
          height: 56 + insets.bottom,
          paddingBottom: 13,
        },
      }}>
      {navItems.map(nav => {
        return (
          <RootTabNavigator.Screen
            key={nav.name}
            name={nav.name}
            component={nav.component}
            options={{
              tabBarIcon: ({focused}) => (
                <View style={[styles.nav, {paddingBottom: insets.bottom}]}>
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
  useAppSetup();
  useGlobalRefresh();
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
      <RootStack.Screen
        name="SecurityAlerts"
        component={SecurityAlertsScreen}
      />
      <RootStack.Screen
        name="AccountActivity"
        component={AccountActivityScreen}
      />
      <RootStack.Screen
        name="ProductAnnouncements"
        component={ProductAnnouncementsScreen}
      />
      <RootStack.Screen name="PriceAlerts" component={PriceAlertsScreen} />
      <RootStack.Screen name="ConnectWallet" component={ConnectWalletScreen} />
      <RootStack.Screen
        name="NotificationsSettings"
        component={NotificationsSettingsScreen}
      />
      <RootStack.Screen
        name="DepositWithNetwork"
        component={DepositWithNetworkScreen}
      />
      <RootStack.Screen
        name="ExportPrivateKey"
        component={ExportPrivateKeyScreen}
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
    borderColor: colors.neutral0,
    backgroundColor: colors.neutral0,
    paddingLeft: 15,
    paddingRight: 15,
    height: 56 + 13,
    paddingBottom: 13,

    shadowColor: colors.neutral500,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
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
