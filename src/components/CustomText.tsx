import React, {type PropsWithChildren} from 'react';
import {Text, StyleSheet, StyleProp, TextStyle} from 'react-native';
import {fonts, colors} from '../styles';

const CustomText: React.FC<
  PropsWithChildren<{
    style?: StyleProp<TextStyle>;
    weight?: 'medium' | 'semi-bold' | 'bold';
  }>
> = ({children, style, weight}) => {
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
    <Text style={[styles.text, {fontFamily: getFontFamily()}, style]}>
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
