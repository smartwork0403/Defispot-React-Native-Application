import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '../styles';

import Modal from './Modal';
import CustomText from './CustomText';

import CheckSvg from '../assets/icons/check.svg';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TradeCompleteModal: React.FC<Props> = ({isOpen, onClose}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      noPadding
      stickyAction={{label: 'Done', onPress: onClose}}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <CheckSvg width={21} height={16} color={colors.neutral0} />
        </View>
        <CustomText weight="semi-bold" style={styles.headerTitle}>
          Complete!
        </CustomText>
      </View>

      <View style={styles.details}>
        <View style={styles.detail}>
          <CustomText style={styles.detailTitle}>Deposit Amount</CustomText>
          <CustomText weight="medium">13.81 LINK</CustomText>
        </View>
        <View style={styles.detail}>
          <CustomText style={styles.detailTitle}>Received Amount</CustomText>
          <CustomText weight="medium">0.9932423 AVAX</CustomText>
        </View>
        <View style={styles.detail}>
          <CustomText style={styles.detailTitle}>Exchange Rate</CustomText>
          <CustomText weight="medium">TX Hash</CustomText>
        </View>
        <View style={styles.detail}>
          <CustomText style={styles.detailTitle}>TX Hash</CustomText>
          <CustomText weight="medium" style={{color: colors.blue}}>
            55d898...93842fb
          </CustomText>
        </View>
        <View style={{...styles.detail, marginBottom: 12}}>
          <CustomText style={styles.detailTitle}>TX Fee</CustomText>
          <CustomText weight="medium">0.80 LINK</CustomText>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 32,
    paddingBottom: 12,
    paddingLeft: 24,
    paddingRight: 24,
    alignItems: 'center',
  },
  headerIcon: {
    height: 64,
    width: 64,
    borderRadius: 64 / 2,
    backgroundColor: colors.green,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    lineHeight: 32,
  },
  details: {
    paddingTop: 12,
    paddingRight: 16,
    paddingLeft: 16,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailTitle: {
    color: colors.neutral500,
    marginRight: 16,
  },
});

export default TradeCompleteModal;
