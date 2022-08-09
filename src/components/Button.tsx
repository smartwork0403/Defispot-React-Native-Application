import React, {type PropsWithChildren} from 'react';
import {
  GestureResponderEvent,
  TouchableOpacity,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {colors} from '../styles';

import CustomText from './CustomText';

export interface Props {
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  accent?: 'black' | 'blue';
  size?: 'small' | 'tiny';
  noOutline?: boolean;
  outlined?: boolean;
  icon?: any;
  prependIcon?: {icon: any; width?: number; height?: number};
  noPadding?: boolean;
  text?: boolean;
  disabled?: boolean;
  textAccent?: 'white' | 'blue';
  style?: StyleProp<ViewStyle>;
  shadowStyle?: StyleProp<ViewStyle>;
}

const Button: React.FC<PropsWithChildren<Props>> = ({
  children,
  onPress,
  accent,
  size,
  noOutline = false,
  outlined = false,
  icon: Icon,
  prependIcon,
  noPadding,
  text,
  textAccent,
  style,
  disabled,
  shadowStyle,
}) => {
  const getBgColor = () => {
    if (noOutline || text) {
      return 'transparent';
    }

    if (disabled) {
      return colors.neutral100;
    }

    if (accent === 'black') {
      return colors.neutral900;
    } else if (accent === 'blue') {
      return colors.blue;
    }
    return colors.neutral0;
  };
  const getBorderColor = () => {
    if (noOutline || text) {
      return 'transparent';
    }

    if (disabled) {
      return colors.neutral100;
    }

    if (outlined) {
      return colors.neutral200;
    }

    if (accent === 'black') {
      return colors.neutral900;
    }
    if (accent === 'blue') {
      return colors.blue;
    }
    return colors.neutral0;
  };
  const getPadding = (side: string) => {
    if (noPadding) {
      return 0;
    }

    if (Icon) {
      return 6;
    }

    if (side === 'top' || side === 'bottom') {
      if (size === 'small') {
        return 4;
      }
      if (size === 'tiny') {
        return 2;
      }

      return 10;
    }

    if (side === 'right' || side === 'left') {
      if (size === 'small' || size === 'tiny') {
        return 12;
      }

      return 16;
    }
  };

  const getColor = () => {
    if (disabled) {
      return colors.neutral400;
    }

    if (accent === 'black' || accent === 'blue' || textAccent === 'white') {
      return colors.neutral0;
    }
    if (textAccent === 'blue') {
      return colors.blue;
    }
    return colors.neutral900;
  };
  const getFontSize = () => {
    if (size === 'tiny') {
      return 12;
    }
    return 14;
  };
  const getLineHeight = () => {
    if (size === 'tiny') {
      return 16;
    }
    return 24;
  };

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.btn,
        {
          backgroundColor: getBgColor(),
          borderColor: getBorderColor(),
          paddingTop: getPadding('top'),
          paddingBottom: getPadding('bottom'),
          paddingRight: getPadding('right'),
          paddingLeft: getPadding('left'),
        },
        style,
        shadowStyle,
      ]}>
      {Icon ? (
        <View style={styles.iconContainer}>
          <Icon
            style={{
              height: size === 'small' || size === 'tiny' ? 12 : 19,
              width: size === 'small' || size === 'tiny' ? 12 : 19,
            }}
            color={colors.neutral900}
          />
        </View>
      ) : (
        <View style={styles.container}>
          {prependIcon && prependIcon.icon && (
            <View style={styles.prependIcon}>
              <prependIcon.icon
                height={prependIcon.height ?? 13}
                width={prependIcon.width ?? 13}
                color={getColor()}
              />
            </View>
          )}
          <CustomText
            weight="medium"
            style={{
              color: getColor(),
              fontSize: getFontSize(),
              lineHeight: getLineHeight(),
            }}>
            {children}
          </CustomText>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderRadius: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
