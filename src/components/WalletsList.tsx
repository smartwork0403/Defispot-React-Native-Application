import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

import CustomText from './CustomText';
import Asset from './Asset';

import CollapsibleCard from './CollapsibleCard';
import Button from './Button';

import SwapSvg from '../assets/icons/swap.svg';
import RefreshSvg from '../assets/icons/refresh.svg';

const Item: React.FC = () => {
  const windowWidth = Dimensions.get('window').width;

  return (
    <CollapsibleCard
      style={styles.item}
      top={
        <>
          <Asset name="USD" value="25.0%" horizontal />
          <CustomText style={styles.itemValue}>25.000</CustomText>
        </>
      }
      bottom={
        <View style={styles.actions}>
          <Button
            outlined
            size="small"
            prependIcon={{icon: SwapSvg}}
            style={{marginRight: 8, width: windowWidth / 2 - 41}}>
            Trade
          </Button>
          <Button
            outlined
            size="small"
            prependIcon={{icon: RefreshSvg}}
            style={{marginLeft: 8, width: windowWidth / 2 - 41}}>
            Deposit
          </Button>
        </View>
      }
    />
  );
};

const WalletsList: React.FC = () => {
  return (
    <View>
      {[...Array(3).keys()].map(k => (
        <Item key={k} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginBottom: 8,
  },
  itemValue: {
    marginLeft: 'auto',
    fontFamily: 'Inter-Medium',
  },
  actions: {
    flexDirection: 'row',
  },
});

export default WalletsList;
