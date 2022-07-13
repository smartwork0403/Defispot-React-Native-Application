import React from 'react';
import {
  GestureResponderEvent,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

const IconButton: React.FC<{
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  icon: any;
  size?: 'small';
  color?: string;
  iconSize?: {width: number; height: number};
  style?: StyleProp<ViewStyle>;
}> = ({onPress, icon: Icon, size, color, iconSize, style}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.btn,
        height: size === 'small' ? 32 : 40,
        width: size === 'small' ? 32 : 40,
        ...style,
      }}>
      <Icon
        width={iconSize?.width ?? 20}
        height={iconSize?.height ?? 20}
        color={color}
      />
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
