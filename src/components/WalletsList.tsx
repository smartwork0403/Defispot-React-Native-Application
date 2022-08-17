import React from 'react';
import {View, StyleSheet} from 'react-native';

import CustomText from './CustomText';
import Asset from './Asset';

import CollapsibleCard from './CollapsibleCard';
import Button from './Button';

import SwapSvg from '../assets/icons/swap.svg';
import RefreshSvg from '../assets/icons/refresh.svg';

const Item: React.FC = () => {
  return (
    <CollapsibleCard
      style={styles.item}
      top={
        <>
          <Asset name="USD" value="25.0%" horizontal />
          <CustomText weight="medium" style={styles.itemValue}>
            25.000
          </CustomText>
        </>
      }
      bottom={
        <View style={styles.actions}>
          <Button
            outlined
            size="small"
            accent="white"
            prependIcon={{icon: SwapSvg}}
            style={{marginRight: 8, flexGrow: 1}}>
            Trade
          </Button>
          <Button
            outlined
            size="small"
            accent="white"
            prependIcon={{icon: RefreshSvg}}
            style={{marginLeft: 8, flexGrow: 1}}>
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
  },
  actions: {
    flexDirection: 'row',
  },
});

export default WalletsList;
