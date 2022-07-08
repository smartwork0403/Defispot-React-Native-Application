import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
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
    backgroundColor: '#F5F5F5',
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
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchIcon: {
    height: 20,
    width: 20,
    color: '#0077FF',
    transform: [{rotate: '90deg'}],
  },
});

export default TradeModule;
