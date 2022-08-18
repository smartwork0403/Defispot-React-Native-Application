import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

import {colors} from '../styles';

import CustomText from './CustomText';
import Modal from './Modal';
import Button from './Button';

import PercentSVG from '../assets/icons/percent.svg';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SlippageModal: React.FC<Props> = ({isOpen, onClose}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      noPadding
      stickyAction={{
        label: 'Cancel',
        onPress: onClose,
        accent: 'white',
        outlined: true,
      }}
      header={{
        title: 'Slippage',
        style: 'no-close',
      }}>
      <View style={styles.container}>
        <View style={{marginBottom: 16}}>
          <CustomText weight="medium" style={styles.label}>
            Slip Tolerance
          </CustomText>

          <View style={styles.options}>
            <View style={styles.slipInputContainer}>
              <TextInput style={styles.slipInput} value={'1'} />
              <View style={styles.slipInputIconContainer}>
                <PercentSVG color={colors.neutral400} height={11} width={11} />
              </View>
            </View>

            <Button
              accent="white"
              size="large"
              outlined
              style={styles.slipOption}>
              0.5%
            </Button>
            <Button accent="grey" size="large" style={styles.slipOption}>
              1%
            </Button>
            <Button
              accent="white"
              size="large"
              outlined
              style={styles.slipOption}>
              3%
            </Button>
          </View>
        </View>
        <View>
          <CustomText weight="medium" style={styles.label}>
            Transaction Fee
          </CustomText>

          <View style={styles.options}>
            <Button
              size="large"
              accent="white"
              outlined
              style={styles.feeOption}>
              Normal
            </Button>
            <Button
              size="large"
              accent="grey"
              style={[styles.feeOption, {marginLeft: 16, marginRight: 16}]}>
              Fast
            </Button>
            <Button
              size="large"
              accent="white"
              outlined
              style={styles.feeOption}>
              Instant
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 12,
  },
  label: {
    marginBottom: 8,
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slipInputContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 16,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.neutral200,
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
  },
  slipInput: {
    color: colors.neutral500,
    height: 24,
    marginRight: 'auto',
    minWidth: 50,
  },
  slipInputIconContainer: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  slipOption: {
    paddingLeft: 16,
    paddingRight: 16,
    marginRight: 16,
  },
  feeOption: {
    flexGrow: 1,
  },
});

export default SlippageModal;
