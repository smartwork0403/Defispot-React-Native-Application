import React from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from './Modal';
import CheckSvg from '../assets/icons/check.svg';
import CustomText from './CustomText';

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
      stickyAction
      actionLabel="Done">
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <CheckSvg width={21} color="#fff" />
          <CustomText>Complete!</CustomText>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {},
  headerIcon: {},
});

export default TradeCompleteModal;
