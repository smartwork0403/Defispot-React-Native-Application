import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';

const Asset: React.FC = () => {
  return (
    <View style={styles.asset}>
      <Image
        source={require('../assets/images/sample.png')}
        style={styles.icon}
      />
      <View>
        <Text style={styles.name}>XLM</Text>
        <Text style={styles.value}>$253,71M</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  asset: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 32,
    width: 32,
    borderRadius: 32 / 2,
    marginRight: 12,
  },

  name: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 24,
    color: '#121315',
  },
  value: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
});

export default Asset;
