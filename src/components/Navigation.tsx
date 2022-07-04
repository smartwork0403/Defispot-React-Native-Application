import React, {type PropsWithChildren} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import MarketsScreen from '../screens/MarketsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TradeScreen from '../screens/TradeScreen';
import WalletScreen from '../screens/WalletScreen';

const Tab = createBottomTabNavigator();

const TradeButton: React.FC<
  PropsWithChildren<{
    onPress: ((event: GestureResponderEvent) => void) | undefined;
  }>
> = ({children, onPress}) => {
  return (
    <TouchableOpacity style={styles.tradeButton} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const navItems = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: 'https://unsplash.it/15/15',
  },
  {
    name: 'Markets',
    component: MarketsScreen,
    icon: 'https://unsplash.it/15/15',
  },
  {
    name: 'Trade',
    component: TradeScreen,
    icon: 'https://unsplash.it/15/15',
  },
  {
    name: 'Wallet',
    component: WalletScreen,
    icon: 'https://unsplash.it/15/15',
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    icon: 'https://unsplash.it/15/15',
  },
];

const Navigation: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 68,
          elevation: 0,
        },
      }}>
      {navItems.map(nav => {
        if (nav.name !== 'Trade') {
          return (
            <Tab.Screen
              key={nav.name}
              name={nav.name}
              component={nav.component}
              options={{
                tabBarIcon: ({focused}) => (
                  <View style={styles.nav}>
                    <Image
                      source={{
                        uri: nav.icon,
                        width: 15,
                        height: 15,
                      }}
                      resizeMode="contain"
                      style={{
                        marginBottom: 5,
                        tintColor: focused ? '#0077FF' : '#A1A1A8',
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '500',
                        lineHeight: 16,
                        color: focused ? '#0077FF' : '#A1A1A8',
                      }}>
                      {nav.name}
                    </Text>
                  </View>
                ),
              }}
            />
          );
        }

        return (
          <Tab.Screen
            key={nav.name}
            name={nav.name}
            component={nav.component}
            options={{
              tabBarIcon: ({focused}) => (
                <View style={styles.nav}>
                  <Image
                    source={{
                      uri: nav.icon,
                      width: 15,
                      height: 15,
                    }}
                    resizeMode="contain"
                    style={{
                      marginBottom: 5,
                      tintColor: focused ? '#0077FF' : '#A1A1A8',
                    }}
                  />
                </View>
              ),
              tabBarButton: props => <TradeButton onPress={props.onPress} />,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  nav: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'thistle',
    borderRadius: 0,
    minWidth: 69,
    minHeight: 52,
  },
  tradeButton: {
    height: 48,
    width: 48,
    backgroundColor: '#0077FF',
    borderRadius: 48 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    top: -7,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default Navigation;
