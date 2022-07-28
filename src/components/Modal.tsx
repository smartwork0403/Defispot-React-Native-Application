import React, {type PropsWithChildren} from 'react';
import {StyleSheet, View, ScrollView, Pressable} from 'react-native';
import Modal from 'react-native-modal';

import Button from './Button';
import CustomText from './CustomText';
import IconButton from './IconButton';

import CloseSvg from '../assets/icons/close.svg';

interface Props {
  noHandle?: boolean;
  stickyAction?: boolean;
  actionLabel?: string;
  onActionPress?: () => void;
  isOpen: boolean;
  onClose: () => void;
  noPadding?: boolean;
  header?: {
    title: string;
  };
  fullHeight?: boolean;
}

const CustomModal: React.FC<PropsWithChildren<Props>> = ({
  noHandle = false,
  stickyAction,
  actionLabel,
  onActionPress,
  isOpen,
  onClose,
  children,
  noPadding,
  header,
  fullHeight,
}) => {
  return (
    <View>
      <Modal
        isVisible={isOpen}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropTransitionOutTiming={0}
        style={{margin: 0, justifyContent: 'flex-end'}}
        customBackdrop={
          <Pressable style={styles.backdrop} onPress={onClose} />
        }>
        <View style={styles.wrapper}>
          {!noHandle && <View style={styles.handle} />}

          <View
            style={{
              ...styles.container,
              height: fullHeight ? '100%' : 'auto',
            }}>
            <ScrollView style={{marginBottom: stickyAction ? 80 : 24}}>
              {header && (
                <View style={styles.header}>
                  <CustomText style={styles.headerTitle}>
                    {header.title}
                  </CustomText>
                  <IconButton
                    icon={CloseSvg}
                    onPress={onClose}
                    size="small"
                    color="#A1A1A8"
                    iconSize={{width: 10, height: 10}}
                    style={styles.headerClose}
                  />
                </View>
              )}

              <View
                style={{
                  ...styles.content,
                  marginTop: noPadding ? 14 : 24,
                  paddingRight: noPadding ? 0 : 24,
                  paddingLeft: noPadding ? 0 : 24,
                }}>
                {children}
              </View>
            </ScrollView>

            {stickyAction && (
              <View style={styles.actions}>
                <Button onPress={onActionPress} accent="black">
                  {actionLabel}
                </Button>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(18,19,21,0.32)',
    flex: 1,
  },
  wrapper: {
    marginTop: 28,
  },
  handle: {
    height: 4,
    width: 48,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginBottom: 12,
    alignSelf: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    paddingRight: 70,
    paddingLeft: 70,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  headerClose: {
    position: 'absolute',
    right: 12,
  },
  content: {
    paddingBottom: 12,
  },
  actions: {
    flex: 1,
    position: 'absolute',
    bottom: 12,
    marginBottom: 12,
    marginRight: 16,
    marginLeft: 16,
    left: 0,
    right: 0,
  },
});

export default CustomModal;
