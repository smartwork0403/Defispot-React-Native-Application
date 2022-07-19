import React from 'react';
import {View, StyleSheet} from 'react-native';

import CustomText from './CustomText';
import Asset from './Asset';

import CollapsibleCard from './CollapsibleCard';

const Item: React.FC = () => {
  return (
    <CollapsibleCard
      style={styles.item}
      top={
        <>
          <Asset name="USD" value="25.0%" horizontal />
          <CustomText style={styles.itemValue}>25.000</CustomText>
        </>
      }
      bottom={<CustomText>collapsed content</CustomText>}
    />
  );
};

const WalletsList: React.FC = () => {
  return (
    <View>
      {[...Array(2).keys()].map(k => (
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
});

export default WalletsList;
