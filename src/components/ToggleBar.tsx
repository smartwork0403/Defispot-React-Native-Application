import React from 'react';
import {View, StyleSheet, Pressable, StyleProp, ViewStyle} from 'react-native';

import {colors, globalStyles} from '../styles';

import CustomText from './CustomText';

const Toggle: React.FC<{
  isActive: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: string;
}> = ({children, isActive, onPress, style}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.toggle,
        {backgroundColor: isActive ? colors.neutral0 : colors.neutral100},
        {...(isActive ? globalStyles.shadow : [])},
        style,
      ]}>
      <CustomText
        weight="medium"
        style={{
          textAlign: 'center',
          color: isActive ? colors.neutral900 : colors.neutral400,
        }}>
        {children}
      </CustomText>
    </Pressable>
  );
};

interface Props {
  items: {value: string; label: string}[];
  selected: string;
  onChange: (value: string) => void;
}

const ToggleBar: React.FC<Props> = ({items, selected, onChange}) => {
  return (
    <View style={{...styles.toggles, ...globalStyles.wrapper}}>
      {items.map(item => (
        <Toggle
          style={{width: `${100 / items.length}%`}}
          key={item.value}
          isActive={selected === item.value}
          onPress={() => onChange(item.value)}>
          {item.label}
        </Toggle>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  toggle: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 24,
    flexGrow: 1,
  },
  toggles: {
    flexDirection: 'row',
    backgroundColor: colors.neutral100,
    padding: 4,
    borderRadius: 100,
  },
});

export default ToggleBar;
