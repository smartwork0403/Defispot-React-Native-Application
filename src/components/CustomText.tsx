import React, {type PropsWithChildren} from 'react';
import {
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import {fonts, colors} from '../styles';

const CustomText: React.FC<
  PropsWithChildren<{
    style?: StyleProp<TextStyle>;
    weight?: 'medium' | 'semi-bold' | 'bold';
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
  }>
> = ({children, style, weight, onPress}) => {
  const getFontFamily = () => {
    if (weight === 'medium') {
      return fonts.interMedium;
    } else if (weight === 'semi-bold') {
      return fonts.interSemiBold;
    } else if (weight === 'bold') {
      return fonts.interBold;
    }
    return fonts.inter;
  };

  return (
    <Text
      onPress={onPress}
      style={[styles.text, {fontFamily: getFontFamily()}, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 24,
    color: colors.neutral900,
  },
});

export default CustomText;
