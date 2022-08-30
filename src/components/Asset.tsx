import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageStyle,
  TextStyle,
  Image,
} from 'react-native';
import {colors, fonts} from '../styles';

import CustomText from './CustomText';

interface Props {
  image: string;
  networkImage?: string;
  name?: string;
  value?: string;
  size?: 'medium' | 'large' | 'small';
  horizontal?: boolean;
}

const Asset: React.FC<Props> = ({
  image,
  networkImage,
  size,
  name,
  value,
  horizontal,
}) => {
  const getIconContainerStyles = () => {
    const style: StyleProp<ViewStyle> = {};
    if (size === 'large') {
      style.marginRight = 20;
    } else if (size === 'medium') {
      style.marginRight = 16;
    } else if (size === 'small') {
      style.marginRight = 8;
    } else {
      style.marginRight = 12;
    }

    return style;
  };

  const getNetworkContainerStyles = () => {
    const style: StyleProp<ViewStyle> = {};
    if (size === 'small') {
      style.height = 16;
      style.width = 16;
      style.borderRadius = 16 / 2;
    } else {
      style.height = 22;
      style.width = 22;
      style.borderRadius = 22 / 2;
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
    } else if (size === 'small') {
      style.height = 24;
      style.width = 24;
      style.borderRadius = 24 / 2;
    } else {
      style.height = 32;
      style.width = 32;
      style.borderRadius = 32 / 2;
    }

    return style;
  };

  const getNetworkStyles = () => {
    const style: StyleProp<ImageStyle> = {};
    if (size === 'small') {
      style.height = 12;
      style.width = 12;
      style.borderRadius = 12 / 2;
    } else {
      style.height = 18;
      style.width = 18;
      style.borderRadius = 18 / 2;
    }

    return style;
  };

  const getNameTextStyles = () => {
    const style: StyleProp<TextStyle> = {};
    if (size === 'large') {
      style.fontSize = 24;
      style.lineHeight = 32;
      style.fontFamily = fonts.interSemiBold;
    } else if (size === 'medium') {
      style.fontSize = 18;
      style.fontFamily = fonts.interMedium;
    } else {
      style.fontFamily = fonts.interMedium;
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
      style.fontFamily = fonts.inter;
    } else if (size === 'medium') {
      style.fontSize = 11;
      style.lineHeight = 16;
      style.fontFamily = fonts.interMedium;
    } else {
      style.fontSize = 12;
      style.lineHeight = 16;
      style.fontFamily = fonts.interMedium;
    }

    return style;
  };

  return (
    <View style={styles.asset}>
      <View style={getIconContainerStyles()}>
        <Image style={getIconStyles()} source={{uri: image}} />
        {networkImage && (
          <View
            style={{
              ...styles.networkContainer,
              ...getNetworkContainerStyles(),
            }}>
            <Image style={getNetworkStyles()} source={{uri: networkImage}} />
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: horizontal ? 'row' : 'column',
          alignItems: horizontal ? 'center' : 'flex-start',
        }}>
        {name && <CustomText style={getNameTextStyles()}>{name}</CustomText>}
        {value && (
          <CustomText
            style={{
              ...styles.value,
              ...getValueTextStyles(),
            }}>
            {value}
          </CustomText>
        )}
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
    backgroundColor: colors.neutral0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -4,
    right: -4,
  },
  value: {
    color: colors.neutral400,
  },
});

export default Asset;
