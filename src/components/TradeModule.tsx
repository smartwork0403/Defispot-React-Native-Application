import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';

import {colors} from '../styles';

import TradeInput from './TradeInput';

import SwapSvg from '../assets/icons/swap.svg';

const TradeModule: React.FC = () => {
  return (
    <View>
      <TradeInput />
      <View style={styles.switcher}>
        <View style={styles.switchBtnContainer}>
          <Pressable style={styles.switchBtn}>
            <SwapSvg style={styles.switchIcon} />
          </Pressable>
        </View>
      </View>
      <TradeInput />
    </View>
  );
};

const styles = StyleSheet.create({
  switcher: {
    alignItems: 'center',
    height: 16,
    zIndex: 10,
  },
  switchBtnContainer: {
    backgroundColor: colors.neutral50,
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    transform: [{translateY: -48 / 2}],
  },
  switchBtn: {
    height: 48,
    width: 48,
    borderRadius: 48 / 2,
    backgroundColor: colors.neutral0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchIcon: {
    height: 20,
    width: 20,
    color: colors.blue,
    transform: [{rotate: '90deg'}],
  },
});

export default TradeModule;
