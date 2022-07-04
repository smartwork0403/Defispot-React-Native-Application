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
    icon: require('../assets/images/sample.png'),
  },
  {
    name: 'Markets',
    component: MarketsScreen,
    icon: require('../assets/images/sample.png'),
  },
  {
    name: 'Trade',
    component: TradeScreen,
    icon: require('../assets/images/sample.png'),
  },
  {
    name: 'Wallet',
    component: WalletScreen,
    icon: require('../assets/images/sample.png'),
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    icon: require('../assets/images/sample.png'),
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
          borderColor: '#fff',
          backgroundColor: '#fff',
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
                      source={nav.icon}
                      resizeMode="contain"
                      style={{
                        marginBottom: 5,
                        width: 15,
                        height: 15,
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
              tabBarIcon: () => (
                <View style={styles.nav}>
                  <Image
                    source={nav.icon}
                    resizeMode="contain"
                    style={{
                      marginBottom: 5,
                      width: 15,
                      height: 15,
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
    backgroundColor: 'blue',
    minWidth: 69,
    minHeight: 52,
  },
  tradeButton: {
    height: 65,
    width: 65,
    backgroundColor: '#0077FF',
    borderRadius: 65 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    top: -11,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 7,
    borderColor: '#fff',
  },
});

export default Navigation;
