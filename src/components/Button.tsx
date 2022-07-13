import React, {type PropsWithChildren} from 'react';
import {
  GestureResponderEvent,
  TouchableOpacity,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import CustomText from './CustomText';

const Button: React.FC<
  PropsWithChildren<{
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
    accent?: 'black' | 'blue';
    size?: 'small' | 'tiny';
    noOutline?: boolean;
    icon?: any;
    prependIcon?: any;
    noPadding?: boolean;
    text?: boolean;
    disabled?: boolean;
    textAccent?: 'white' | 'blue';
    style?: StyleProp<ViewStyle>;
  }>
> = ({
  children,
  onPress,
  accent,
  size,
  noOutline = false,
  icon: Icon,
  prependIcon: PrependIcon,
  noPadding,
  text,
  textAccent,
  style,
  disabled,
}) => {
  const getBgColor = () => {
    if (noOutline || text) {
      return 'transparent';
    }

    if (disabled) {
      return '#EFF0F3';
    }

    if (accent === 'black') {
      return '#121315';
    } else if (accent === 'blue') {
      return '#0077FF';
    }
    return '#fff';
  };
  const getBorderColor = () => {
    if (noOutline || text) {
      return 'transparent';
    }

    if (disabled) {
      return '#EFF0F3';
    }

    if (accent === 'black') {
      return '#121315';
    }
    if (accent === 'blue') {
      return '#0077FF';
    }
    return '#ffff';
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
      return '#A1A1A8';
    }

    if (accent === 'black' || accent === 'blue' || textAccent === 'white') {
      return '#fff';
    }
    if (textAccent === 'blue') {
      return '#0077FF';
    }
    return '#121315';
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
    <DropShadow
      style={{
        shadowColor: '#8d8d94',
        shadowOffset: {width: 2, height: 4},
        shadowRadius: 8,
        shadowOpacity: 0.06,
      }}>
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={{
          ...styles.btn,
          backgroundColor: getBgColor(),
          borderColor: getBorderColor(),
          paddingTop: getPadding('top'),
          paddingBottom: getPadding('bottom'),
          paddingRight: getPadding('right'),
          paddingLeft: getPadding('left'),
          ...style,
        }}>
        {Icon ? (
          <View style={styles.iconContainer}>
            <Icon
              style={{
                height: size === 'small' || size === 'tiny' ? 12 : 19,
                width: size === 'small' || size === 'tiny' ? 12 : 19,
              }}
            />
          </View>
        ) : (
          <View style={styles.container}>
            {PrependIcon && (
              <View style={styles.prependIcon}>
                <PrependIcon height={13} width={13} color={getColor()} />
              </View>
            )}
            <CustomText
              style={{
                ...styles.text,
                color: getColor(),
                fontSize: getFontSize(),
                lineHeight: getLineHeight(),
              }}>
              {children}
            </CustomText>
          </View>
        )}
      </TouchableOpacity>
    </DropShadow>
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
  text: {
    fontFamily: 'Inter-Medium',
  },
});

export default Button;
