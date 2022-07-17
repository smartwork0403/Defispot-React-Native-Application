import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  StyleProp,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from 'react-native';
import CustomText from './CustomText';

interface Props {
  name: string;
  value: string;
  size?: 'medium' | 'large';
  horizontal?: boolean;
}

const Asset: React.FC<Props> = ({size, name, value, horizontal}) => {
  const getIconContainerStyles = () => {
    const style: StyleProp<ViewStyle> = {};
    if (size === 'large') {
      style.marginRight = 20;
    } else if (size === 'medium') {
      style.marginRight = 16;
    } else {
      style.marginRight = 12;
    }

    return style;
  };

  const getIconStyles = () => {
    const style: StyleProp<ImageStyle> = {};
    if (size === 'large') {
      style.height = 48;
      style.width = 48;
      style.borderRadius = 48 / 2;
    } else if (size === 'medium') {
      style.height = 40;
      style.width = 40;
      style.borderRadius = 40 / 2;
    } else {
      style.height = 32;
      style.width = 32;
      style.borderRadius = 32 / 2;
    }

    return style;
  };

  const getNameTextStyles = () => {
    const style: StyleProp<TextStyle> = {};
    if (size === 'large') {
      style.fontSize = 24;
      style.lineHeight = 32;
      style.fontFamily = 'Inter-SemiBold';
    } else if (size === 'medium') {
      style.fontSize = 18;
      style.fontFamily = 'Inter-Medium';
    } else {
      style.fontFamily = 'Inter-Medium';
    }

    if (horizontal) {
      style.marginRight = 4;
    }

    return style;
  };

  const getValueTextStyles = () => {
    const style: StyleProp<TextStyle> = {};
    if (size === 'large') {
      style.fontSize = 14;
      style.fontFamily = 'Inter-Regular';
    } else if (size === 'medium') {
      style.fontSize = 11;
      style.lineHeight = 16;
      style.fontFamily = 'Inter-Medium';
    } else {
      style.fontSize = 12;
      style.lineHeight = 16;
      style.fontFamily = 'Inter-Medium';
    }

    return style;
  };

  return (
    <View style={styles.asset}>
      <View style={getIconContainerStyles()}>
        <Image
          source={require('../assets/images/sample.png')}
          style={getIconStyles()}
        />
        <View style={styles.networkContainer}>
          <Image
            source={require('../assets/images/sample.png')}
            style={styles.network}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: horizontal ? 'row' : 'column',
          alignItems: horizontal ? 'center' : 'flex-start',
        }}>
        <CustomText style={getNameTextStyles()}>{name}</CustomText>
        <CustomText
          style={{
            ...styles.value,
            ...getValueTextStyles(),
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
    height: 22,
    width: 22,
    borderRadius: 22 / 2,
    bottom: -4,
    right: -4,
  },
  network: {
    height: 18,
    width: 18,
    borderRadius: 18 / 2,
  },
  value: {
    color: '##A1A1A8',
  },
});

export default Asset;
