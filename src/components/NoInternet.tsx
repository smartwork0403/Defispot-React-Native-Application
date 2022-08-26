import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import {colors} from '../styles';

import CustomText from './CustomText';

import WifiNoConnectionSVG from '../assets/icons/wifi-no-connection.svg';

const NoInternet: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View
      style={[styles.noInternet, {display: !isConnected ? 'flex' : 'none'}]}>
      <View style={styles.noInternetIconContainer}>
        <WifiNoConnectionSVG width={16} height={14} color={colors.redDark} />
      </View>

      <CustomText weight="medium" style={styles.noInternetText}>
        No internet connection
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  noInternet: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 24,
    paddingRight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.redLight,
  },
  noInternetIconContainer: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  noInternetText: {
    color: colors.redDark,
  },
});

export default NoInternet;
