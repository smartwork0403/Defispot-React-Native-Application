import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';

import {colors} from '../styles';

import Card from './Card';
import CustomText from './CustomText';
import Switch from './Switch';

import type {Props as SwitchProps} from './Switch';

interface Props extends SwitchProps {
  title: string;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

const SwitchCard: React.FC<Props> = ({
  title,
  label,
  style,
  isActive,
  onToggle,
}) => {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.info}>
        <CustomText>{title}</CustomText>

        {label && <CustomText style={styles.label}> ({label})</CustomText>}
      </View>
      <Switch isActive={isActive} onToggle={onToggle} />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingLeft: 20,
  },
  info: {
    marginRight: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  label: {
    color: colors.neutral500,
  },
});

export default SwitchCard;
