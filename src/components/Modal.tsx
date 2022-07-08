import React, {type PropsWithChildren} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Button from './Button';

interface Props {
  noHandle?: boolean;
  stickyAction?: boolean;
  actionLabel?: string;
  onActionPress?: () => void;
  isOpen: boolean;
  onClose: () => void;
  noPadding?: boolean;
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
}) => {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        onRequestClose={onClose}>
        <TouchableOpacity style={styles.overlay} onPress={onClose}>
          <View>
            {!noHandle && <View style={styles.handle} />}
            <TouchableWithoutFeedback>
              <View style={styles.container}>
                <ScrollView style={{marginBottom: stickyAction ? 80 : 24}}>
                  <View
                    style={{
                      ...styles.content,
                      paddingTop: noPadding ? 12 : 24,
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(18,19,21,0.32)',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    paddingTop: 40,
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
  content: {
    paddingBottom: 12,
  },
  actions: {
    flex: 1,
    position: 'absolute',
    bottom: 12,
    marginBottom: 12,
    marginRight: 24,
    marginLeft: 24,
    left: 0,
    right: 0,
  },
});

export default CustomModal;
