import React, {type PropsWithChildren} from 'react';
import {Text, StyleSheet, StyleProp, TextStyle} from 'react-native';

const CustomText: React.FC<
  PropsWithChildren<{
    style?: StyleProp<TextStyle>;
  }>
> = ({children, style}) => {
  // @ts-ignore
  return <Text style={{...styles.text, ...style}}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 24,
    color: '#121315',
  },
});

export default CustomText;
