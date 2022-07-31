import React from 'react';
import {View, StyleSheet} from 'react-native';
import CustomText from './CustomText';

const MarketsStats: React.FC = () => {
  return (
    <View style={styles.container}>
      <View>
        <CustomText weight="medium" style={styles.statsTitle}>
          24h Volume
        </CustomText>
        <CustomText weight="medium" style={styles.statsValue}>
          $500,73M
        </CustomText>
      </View>
      <View style={styles.divider} />
      <View>
        <CustomText weight="medium" style={styles.statsTitle}>
          Open Interest
        </CustomText>
        <CustomText weight="medium" style={styles.statsValue}>
          $323,22M
        </CustomText>
      </View>
      <View style={styles.divider} />
      <View>
        <CustomText weight="medium" style={styles.statsTitle}>
          Trades
        </CustomText>
        <CustomText weight="medium" style={styles.statsValue}>
          115.279
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 11,
    lineHeight: 16,
    color: '#8D8D94',
    textAlign: 'center',
  },
  statsValue: {
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
