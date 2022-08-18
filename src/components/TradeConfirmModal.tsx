import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors, globalStyles} from '../styles';

import Asset from './Asset';
import CustomText from './CustomText';
import Modal from './Modal';

import SwapSvg from '../assets/icons/swap.svg';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Select: React.FC<Props> = ({isOpen, onClose}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      noPadding
      stickyAction={{label: 'Confirm Swap'}}
      noHandle
      fullHeight
      header={{title: 'Confirm'}}>
      <View style={styles.trade}>
        <Asset name="123" value="LINK" size="large" />
        <CustomText weight="medium" style={styles.tradeType}>
          Native
        </CustomText>
      </View>
      <View style={styles.switcher}>
        <View style={styles.switchBtnContainer}>
          <View style={{...styles.switchBtn, ...globalStyles.shadow}}>
            <SwapSvg style={styles.switchIcon} />
          </View>
        </View>
      </View>
      <View style={styles.trade}>
        <Asset name="50" value="AVAX" size="large" />
        <CustomText weight="medium" style={styles.tradeType}>
          Native
        </CustomText>
      </View>

      <View style={styles.details}>
        <View style={styles.detail}>
          <CustomText style={styles.detailTitle}>Est. Time</CustomText>
          <CustomText weight="medium">{'<10m'}</CustomText>
        </View>
        <View style={styles.detail}>
          <CustomText style={styles.detailTitle}>Fee</CustomText>
          <CustomText weight="medium">$2.02</CustomText>
        </View>
        <View style={styles.detail}>
          <CustomText style={styles.detailTitle}>Slippage</CustomText>
          <CustomText weight="medium">0.00101</CustomText>
        </View>
        <View style={styles.detail}>
          <CustomText style={styles.detailTitle}>Min Received</CustomText>
          <CustomText weight="medium">0.00101</CustomText>
        </View>
        <View style={styles.detail}>
          <CustomText style={styles.detailTitle}>Exchange Fee</CustomText>
          <CustomText weight="medium">$0.12</CustomText>
        </View>
        <View style={styles.detail}>
          <CustomText style={styles.detailTitle}>Recipient</CustomText>
          <CustomText style={{color: colors.blue}}>tho...5w3</CustomText>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  trade: {
    borderBottomColor: colors.neutral100,
    borderTopColor: colors.neutral100,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  tradeType: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 24,
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 16,
    backgroundColor: colors.neutral50,
  },
  switcher: {
    alignItems: 'center',
    height: 24,
    zIndex: 10,
  },
  switchBtnContainer: {
    backgroundColor: colors.neutral0,
    height: 68,
    width: 68,
    borderRadius: 68 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '50%',
    transform: [{translateY: -56 / 2}],
  },
  switchBtn: {
    height: 56,
    width: 56,
    borderRadius: 56 / 2,
    backgroundColor: colors.neutral900,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchIcon: {
    height: 20,
    width: 20,
    color: colors.neutral0,
    transform: [{rotate: '90deg'}],
  },
  details: {
    paddingTop: 16,
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 60,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailTitle: {
    color: colors.neutral500,
    marginRight: 16,
  },
});

export default Select;
