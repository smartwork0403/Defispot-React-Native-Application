import React, {type PropsWithChildren} from 'react';
import {
  GestureResponderEvent,
  TouchableOpacity,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors, globalStyles} from '../styles';

import CustomText from './CustomText';

export interface Props {
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  accent?: 'black' | 'white' | 'red';
  size?: 'large' | 'small' | 'tiny';
  prependIcon?: {icon: any; width?: number; height?: number; color?: string};
  outlined?: boolean;
  text?: boolean;
  disabled?: boolean;
  shadow?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Button: React.FC<PropsWithChildren<Props>> = ({
  children,
  onPress,
  accent,
  size,
  prependIcon,
  outlined,
  text,
  disabled,
  shadow,
  style,
}) => {
  const getStyles = () => {
    let customStyles: StyleProp<ViewStyle> = {};

    if (size === 'large') {
      // height = 44
      customStyles.paddingTop = 10;
      customStyles.paddingBottom = 10;
      customStyles.paddingLeft = 24;
      customStyles.paddingRight = 24;
    } else if (size === 'tiny' || size === 'small') {
      // small height = 32
      // tiny height = 24
      customStyles.paddingTop = 4;
      customStyles.paddingBottom = 4;
      customStyles.paddingLeft = 12;
      customStyles.paddingRight = 12;
    } else {
      // default - height = 40
      customStyles.paddingTop = 8;
      customStyles.paddingBottom = 8;
      customStyles.paddingLeft = 24;
      customStyles.paddingRight = 24;
    }

    if (accent === 'black') {
      customStyles.backgroundColor = colors.neutral900;
      customStyles.borderColor = colors.neutral900;
    } else if (accent === 'red') {
      customStyles.backgroundColor = colors.red;
      customStyles.borderColor = colors.red;
    } else if (accent === 'white') {
      customStyles.backgroundColor = colors.neutral0;
      customStyles.borderColor = colors.neutral0;

      if (outlined) {
        customStyles.borderColor = colors.neutral200;
      }
    } else {
      // default
      customStyles.backgroundColor = colors.blue;
      customStyles.borderColor = colors.blue;
    }

    if (outlined) {
      customStyles.backgroundColor = colors.neutral0;
    }

    if (text) {
      customStyles.paddingTop = 0;
      customStyles.paddingBottom = 0;
      customStyles.paddingLeft = 0;
      customStyles.paddingRight = 0;
      customStyles.backgroundColor = 'transparent';
      customStyles.borderColor = 'transparent';
      customStyles.borderRadius = 0;
    }

    // ! order is important for this
    if (disabled) {
      customStyles.backgroundColor = colors.neutral100;
      customStyles.borderColor = colors.neutral100;
    }

    if (shadow) {
      customStyles = Object.assign(customStyles, globalStyles.shadow);
    }

    return customStyles;
  };

  const getTextStyles = () => {
    const customStyles: StyleProp<TextStyle> = {};

    if (size === 'tiny') {
      customStyles.fontSize = 12;
      customStyles.lineHeight = 16;
    }

    if (!outlined) {
      customStyles.color = colors.neutral0;

      if (accent === 'white') {
        customStyles.color = colors.neutral900;
      }
    } else {
      if (accent === 'black') {
        customStyles.color = colors.neutral900;
      } else if (accent === 'red') {
        customStyles.color = colors.red;
      } else if (accent === 'white') {
        customStyles.color = colors.neutral900;
      } else {
        // default
        customStyles.color = colors.blue;
      }
    }

    if (text) {
      if (accent === 'black') {
        customStyles.color = colors.neutral900;
      } else if (accent === 'red') {
        customStyles.color = colors.red;
      } else if (accent === 'white') {
        customStyles.color = colors.neutral0;
      } else {
        // default
        customStyles.color = colors.blue;
      }
    }

    // ! order is important for this
    if (disabled) {
      customStyles.color = colors.neutral400;
    }

    return customStyles;
  };

  const getIconColor = () => {
    if (!outlined) {
      if (accent === 'white') {
        return colors.neutral900;
      }

      return colors.neutral0;
    } else {
      if (accent === 'black') {
        return colors.neutral900;
      } else if (accent === 'red') {
        return colors.red;
      } else if (accent === 'white') {
        return colors.neutral900;
      }
      // default
      return colors.blue;
    }
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.btn, getStyles(), style]}>
      {prependIcon && prependIcon.icon && (
        <View style={styles.prependIcon}>
          <prependIcon.icon
            height={prependIcon.height ?? 14}
            width={prependIcon.width ?? 14}
            color={prependIcon.color ?? getIconColor()}
          />
        </View>
      )}
      <CustomText weight="medium" style={[getTextStyles()]}>
        {children}
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  prependIcon: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
});

export default Button;
