import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '../styles';
import Button from './Button';

import CustomText from './CustomText';
import Modal from './Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onContinuePress: () => void;
}

const ProfileDangerZoneModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onContinuePress,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      noPadding
      header={{title: 'Danger Zone', style: 'no-close'}}>
      <View style={styles.content}>
        <View style={styles.info}>
          <CustomText style={styles.message}>
            For advanced users only. Enter your own risk.
          </CustomText>
          <CustomText style={styles.danger}>
            These settings can cause funds to be irrecoverably lost.
          </CustomText>
        </View>

        <View style={styles.actions}>
          <Button
            accent="white"
            outlined
            size="large"
            onPress={onClose}
            style={{marginBottom: 16}}>
            Go back
          </Button>
          <Button size="large" onPress={onContinuePress}>
            I understand, continue
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 12,
  },
  info: {
    padding: 12,
  },
  message: {
    color: colors.neutral600,
    marginBottom: 16,
    textAlign: 'center',
  },
  danger: {
    color: colors.red,
    textAlign: 'center',
  },
  actions: {
    paddingTop: 12,
  },
});

export default ProfileDangerZoneModal;
