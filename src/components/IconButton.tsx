import React from 'react';
import {
  GestureResponderEvent,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const IconButton: React.FC<{
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  icon: any;
  size?: 'small';
  color?: string;
}> = ({onPress, icon: Icon, size, color}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.btn,
        height: size === 'small' ? 32 : 40,
        width: size === 'small' ? 32 : 40,
      }}>
      <Icon width={20} height={20} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconButton;
