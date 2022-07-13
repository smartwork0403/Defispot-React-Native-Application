import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import CustomText from './CustomText';

interface Props {
  name: string;
  value: string;
  size?: 'large';
  horizontal?: boolean;
}

const Asset: React.FC<Props> = ({size, name, value, horizontal}) => {
  return (
    <View style={styles.asset}>
      <View
        style={{
          marginRight: size === 'large' ? 20 : 12,
        }}>
        <Image
          source={require('../assets/images/sample.png')}
          style={{
            height: size === 'large' ? 48 : 32,
            width: size === 'large' ? 48 : 32,
            borderRadius: size === 'large' ? 48 / 2 : 32 / 2,
          }}
        />
        <View
          style={{
            ...styles.networkContainer,
            height: size === 'large' ? 30 : 22,
            width: size === 'large' ? 30 : 22,
            borderRadius: size === 'large' ? 30 : 22 / 2,
            bottom: size === 'large' ? -8 : -6,
            right: size === 'large' ? -8 : -6,
          }}>
          <Image
            source={require('../assets/images/sample.png')}
            style={{
              height: size === 'large' ? 25 : 18,
              width: size === 'large' ? 25 : 18,
              borderRadius: size === 'large' ? 25 / 2 : 18 / 2,
            }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: horizontal ? 'row' : 'column',
          alignItems: horizontal ? 'center' : 'flex-start',
        }}>
        <CustomText
          style={{
            fontSize: size === 'large' ? 24 : 14,
            lineHeight: size === 'large' ? 32 : 24,
            fontFamily: size === 'large' ? 'Inter-SemiBold' : 'Inter-Medium',
            marginRight: horizontal ? 4 : 0,
          }}>
          {name}
        </CustomText>
        <CustomText
          style={{
            ...styles.value,
            fontSize: size === 'large' ? 14 : 12,
            fontFamily: size === 'large' ? 'Inter-Regular' : 'Inter-Medium',
            lineHeight: size === 'large' ? 24 : 16,
          }}>
          {value}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  asset: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  value: {
    color: '##A1A1A8',
  },
});

export default Asset;
