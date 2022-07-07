import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import CustomText from './CustomText';

const Asset: React.FC = () => {
  return (
    <View style={styles.asset}>
      <Image
        source={require('../assets/images/sample.png')}
        style={styles.icon}
      />
      <View>
        <CustomText style={styles.name}>XLM</CustomText>
        <CustomText style={styles.value}>$253,71M</CustomText>
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
    fontFamily: 'Inter-Medium',
  },
  value: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    lineHeight: 16,
    color: '##A1A1A8',
  },
});

export default Asset;
