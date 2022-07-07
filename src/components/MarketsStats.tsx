import React from 'react';
import {View, StyleSheet} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import CustomText from './CustomText';

const MarketsStats: React.FC = () => {
  return (
    <DropShadow
      style={{
        shadowColor: '#8d8d94',
        shadowOffset: {width: 2, height: 4},
        shadowRadius: 8,
        shadowOpacity: 0.06,
      }}>
      <View style={styles.container}>
        <View>
          <CustomText style={styles.statsTitle}>24h Volume</CustomText>
          <CustomText style={styles.statsValue}>$500,73M</CustomText>
        </View>
        <View style={styles.divider} />
        <View>
          <CustomText style={styles.statsTitle}>Open Interest</CustomText>
          <CustomText style={styles.statsValue}>$323,22M</CustomText>
        </View>
        <View style={styles.divider} />
        <View>
          <CustomText style={styles.statsTitle}>Trades</CustomText>
          <CustomText style={styles.statsValue}>115.279</CustomText>
        </View>
      </View>
    </DropShadow>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
  },
  statsTitle: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    lineHeight: 16,
    color: '#8D8D94',
    textAlign: 'center',
  },
  statsValue: {
    fontFamily: 'Inter-Medium',
    minWidth: 83,
    textAlign: 'center',
  },
  divider: {
    height: 24,
    width: 1,
    backgroundColor: '#EFF0F3',
  },
});

export default MarketsStats;
