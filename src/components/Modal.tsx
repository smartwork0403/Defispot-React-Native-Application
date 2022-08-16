import React, {type PropsWithChildren} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  StyleProp,
  ViewStyle,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import {colors} from '../styles';

import type {Props as ActionProps} from './Button';

import Button from './Button';
import CustomText from './CustomText';
import IconButton from './IconButton';

import CloseSvg from '../assets/icons/close.svg';

interface StickyAction extends ActionProps {
  label: string;
}

interface Props {
  noHandle?: boolean;
  stickyAction?: StickyAction;
  stickyActionSpaceSize?: 'large';
  isOpen: boolean;
  onClose: () => void;
  noPadding?: boolean;
  header?: {
    title: string;
    style?: 'no-close';
  };
  fullHeight?: boolean;
}

const CustomModal: React.FC<PropsWithChildren<Props>> = ({
  noHandle = false,
  stickyAction,
  stickyActionSpaceSize,
  isOpen,
  onClose,
  children,
  noPadding,
  header,
  fullHeight,
}) => {
  const windowHeight = Dimensions.get('window').height;

  const getStickyActionStyles = () => {
    let customStyles: StyleProp<ViewStyle> = {};

    customStyles.paddingLeft = 16;
    customStyles.paddingRight = 16;
    customStyles.paddingBottom = 12;
    customStyles.paddingTop = 12;

    if (stickyActionSpaceSize === 'large') {
      customStyles.paddingLeft = 24;
      customStyles.paddingRight = 24;
      customStyles.paddingBottom = 24;
      customStyles.paddingTop = 24;
    }

    return customStyles;
  };

  const getContentStyle = () => {
    const customStyles: StyleProp<ViewStyle> = {};

    customStyles.paddingLeft = 24;
    customStyles.paddingRight = 24;
    customStyles.paddingTop = 24;

    if (!stickyAction) {
      customStyles.paddingBottom = 24;
    }

    if (noPadding) {
      customStyles.paddingLeft = 0;
      customStyles.paddingRight = 0;
      customStyles.paddingBottom = 0;
      customStyles.paddingTop = 0;
    }

    return customStyles;
  };

  const getHeaderStyle = () => {
    const customStyles: StyleProp<ViewStyle> = {};

    customStyles.paddingTop = 20;
    customStyles.paddingBottom = 10;
    customStyles.paddingRight = 70;
    customStyles.paddingLeft = 70;

    if (header && header.style === 'no-close') {
      customStyles.paddingTop = 16;
      customStyles.paddingBottom = 16;
      customStyles.paddingRight = 20;
      customStyles.paddingLeft = 20;
      customStyles.borderBottomColor = colors.neutral100;
      customStyles.borderBottomWidth = 1;
    }

    return customStyles;
  };

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
        <View style={styles.handleContainer}>
          {!noHandle && <View style={styles.handle} />}
        </View>

        <View
          style={{
            ...styles.container,
            maxHeight: windowHeight - 60,
            height: fullHeight ? '100%' : 'auto',
          }}>
          {header && (
            <View style={[styles.header, getHeaderStyle()]}>
              <CustomText weight="medium" style={styles.headerTitle}>
                {header.title}
              </CustomText>

              {header.style !== 'no-close' && (
                <IconButton
                  icon={CloseSvg}
                  onPress={onClose}
                  size="small"
                  color={colors.neutral400}
                  iconSize={{width: 10, height: 10}}
                  style={styles.headerClose}
                />
              )}
            </View>
          )}

          <ScrollView>
            <View style={getContentStyle()}>{children}</View>
          </ScrollView>

          {stickyAction && (
            <View style={[getStickyActionStyles()]}>
              <Button
                accent={stickyAction.accent}
                size="large"
                {...stickyAction}>
                {stickyAction.label}
              </Button>
            </View>
          )}
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
  handleContainer: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    height: 4,
    width: 48,
    borderRadius: 4,
    backgroundColor: colors.neutral0,
  },
  container: {
    backgroundColor: colors.neutral0,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
  },
  headerClose: {
    position: 'absolute',
    right: 12,
  },
});

export default CustomModal;
