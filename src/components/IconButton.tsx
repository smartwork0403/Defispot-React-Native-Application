import React from 'react';
import {
  GestureResponderEvent,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {colors, globalStyles} from '../styles';

const IconButton: React.FC<{
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  icon: any;
  size?: 'small' | 'large'; // small = 32 / default = 36 / large = 40
  color?: string;
  iconSize?: {width: number; height: number};
  style?: StyleProp<ViewStyle>;
  outlined?: boolean;
  accent?: 'white';
  shadow?: boolean;
}> = ({
  onPress,
  icon: Icon,
  size,
  color,
  iconSize,
  style,
  outlined,
  accent,
  shadow,
}) => {
  const getStyles = () => {
    let customStyles: StyleProp<ViewStyle> = {};

    if (size === 'small') {
      customStyles.height = 32;
      customStyles.width = 32;
      customStyles.borderRadius = 32 / 2;
    } else if (size === 'large') {
      customStyles.height = 40;
      customStyles.width = 40;
      customStyles.borderRadius = 40 / 2;
    } else {
      customStyles.height = 36;
      customStyles.width = 36;
      customStyles.borderRadius = 36 / 2;
    }

    if (outlined) {
      customStyles.borderWidth = 1;
      customStyles.borderColor = colors.neutral100;
    }

    if (accent === 'white') {
      customStyles.backgroundColor = colors.neutral0;
    }

    if (shadow) {
      customStyles = Object.assign(customStyles, globalStyles.shadow);
    }

    return customStyles;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, getStyles(), style]}>
      <Icon
        width={iconSize?.width ?? 19.33}
        height={iconSize?.height ?? 19.33}
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
