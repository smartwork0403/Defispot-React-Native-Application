import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors} from '../styles';

import CustomText from './CustomText';
import Modal from './Modal';
import RecoveryPhraseList from './RecoveryPhraseList';
import type {Props as RecoveryPhraseListProps} from './RecoveryPhraseList';
import TextField from './TextField';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  phrases: RecoveryPhraseListProps['list'];
  onActionPress: () => void;
}

const RecoveryPhrase: React.FC<Props> = ({
  isOpen,
  onClose,
  phrases,
  onActionPress,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      noPadding
      stickyAction={{label: 'Continue', onPress: onActionPress}}
      noHandle
      fullHeight
      header={{title: 'Your recovery phrase'}}>
      <CustomText style={styles.info}>
        Write down or copy these words in the right order and save them
        somewhere safe.
      </CustomText>
      <RecoveryPhraseList list={phrases} />
      <View style={styles.content}>
        <TextField label="Wallet Name" placeholder="My wallet" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  info: {
    color: colors.neutral500,
    margin: 0,
    padding: 0,
    marginRight: 16,
    marginLeft: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  content: {
    padding: 24,
  },
});

export default RecoveryPhrase;
