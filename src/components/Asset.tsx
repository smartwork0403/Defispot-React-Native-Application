import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import CustomText from './CustomText';

const Asset: React.FC = () => {
  return (
    <View style={styles.asset}>
      <View style={styles.iconContainer}>
        <Image
          source={require('../assets/images/sample.png')}
          style={styles.icon}
        />
        <View style={styles.networkContainer}>
          <Image
            source={require('../assets/images/sample.png')}
            style={styles.network}
          />
        </View>
      </View>
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
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    height: 32,
    width: 32,
    borderRadius: 32 / 2,
  },
  networkContainer: {
    height: 22,
    width: 22,
    backgroundColor: '#fff',
    borderRadius: 22 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -5,
    right: -5,
  },
  network: {
    height: 18,
    width: 18,
    borderRadius: 18 / 2,
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
