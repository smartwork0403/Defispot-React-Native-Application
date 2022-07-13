import React, {useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Collapsible from 'react-native-collapsible';

import CustomText from './CustomText';
import Asset from './Asset';

import ChevronDownSvg from '../assets/icons/chevron-down.svg';

const Item: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <View style={styles.item}>
      <View style={styles.top}>
        <Asset name="USD" value="25.0%" horizontal />
        <CustomText style={styles.topValue}>25.000</CustomText>

        <Pressable
          style={styles.topButton}
          onPress={() => setIsCollapsed(!isCollapsed)}>
          <ChevronDownSvg
            height={4}
            width={7}
            color="#121315"
            style={{transform: [{rotate: isCollapsed ? '0deg' : '180deg'}]}}
          />
        </Pressable>
      </View>

      <Collapsible style={styles.bottom} collapsed={isCollapsed}>
        <CustomText>collapsed content</CustomText>
      </Collapsible>
    </View>
  );
};

const WalletsList: React.FC = () => {
  return (
    <View style={styles.list}>
      {[...Array(20).keys()].map(k => (
        <Item key={k} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 8,
  },
  item: {
    marginBottom: 8,
  },
  top: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 16,
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFF0F3',
  },
  topValue: {
    marginLeft: 'auto',
    fontFamily: 'Inter-Medium',
  },
  topButton: {
    marginLeft: 12,
    height: 24,
    width: 24,
    borderRadius: 24 / 2,
    backgroundColor: '#EFF0F3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {backgroundColor: 'red'},
});

export default WalletsList;
