import React, {type PropsWithChildren} from 'react';
import {Text, StyleSheet, StyleProp, TextStyle} from 'react-native';

const CustomText: React.FC<
  PropsWithChildren<{
    style?: StyleProp<TextStyle>;
    weight?: 'medium' | 'semi-bold' | 'bold';
  }>
> = ({children, style, weight}) => {
  const getFontFamily = () => {
    if (weight === 'medium') {
      return 'Inter-Medium';
    } else if (weight === 'semi-bold') {
      return 'Inter-SemiBold';
    } else if (weight === 'bold') {
      return 'Inter-Bold';
    }
    return 'Inter-Regular';
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
    color: '#121315',
  },
});

export default CustomText;
