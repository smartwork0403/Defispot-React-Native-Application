import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const MarketsStats: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.stats}>
        <Text style={styles.statsTitle}>24h Volume</Text>
        <Text style={styles.statsValue}>$500,73M</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.stats}>
        <Text style={styles.statsTitle}>24h Volume</Text>
        <Text style={styles.statsValue}>$500,73M</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.stats}>
        <Text style={styles.statsTitle}>24h Volume</Text>
        <Text style={styles.statsValue}>$500,73M</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'green',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stats: {},
  statsTitle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: '#8D8D94',
  },
  statsValue: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    minWidth: 79,
    color: '#121315',
  },
  divider: {
    height: 24,
    width: 1,
    backgroundColor: '#EFF0F3',
  },
});

export default MarketsStats;
