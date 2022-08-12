import React from 'react';
import {View, StyleSheet} from 'react-native';
import {colors} from '../styles';

import CustomText from './CustomText';
import IconButton from './IconButton';

import ArrowLeft from '../assets/icons/arrow-left.svg';

interface Props {
  onBack: () => void;
  title: string;
  subtitle: string;
}

const WizardHeader: React.FC<Props> = ({onBack, title, subtitle}) => {
  return (
    <View style={styles.header}>
      <IconButton
        icon={ArrowLeft}
        outlined
        color={colors.neutral900}
        iconSize={{width: 14.25, height: 10.5}}
        style={{marginBottom: 16}}
        onPress={onBack}
      />
      <CustomText style={styles.title} weight="semi-bold">
        {title}
      </CustomText>
      <CustomText style={styles.subtitle}>{subtitle}</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 24,
    borderBottomColor: colors.neutral100,
    borderBottomWidth: 1,
    backgroundColor: colors.neutral0,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
  },
  subtitle: {
    color: colors.neutral500,
  },
});

export default WizardHeader;
