import React, {type PropsWithChildren} from 'react';
import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const Button: React.FC<
  PropsWithChildren<{
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
    accent?: 'black' | 'grey';
    size?: 'small' | 'tiny';
    noOutline?: boolean;
    prependIcon?: any;
    appendIcon?: any;
    icon?: any;
  }>
> = ({
  children,
  onPress,
  accent,
  size,
  noOutline = false,
  prependIcon,
  appendIcon,
  icon,
}) => {
  const getBgColor = () => {
    if (noOutline) {
      return 'transparent';
    }

    if (accent === 'black') {
      return '#121315';
    } else if (accent === 'grey') {
      return '#EFF0F3';
    }
    return '#fff';
  };
  const getBorderColor = () => {
    if (noOutline) {
      return 'transparent';
    }

    if (accent === 'black') {
      return '#121315';
    }
    return '#EFF0F3';
  };
  const getPadding = (side: string) => {
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
    if (accent === 'black') {
      return '#fff';
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
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.btn,
        backgroundColor: getBgColor(),
        borderColor: getBorderColor(),
        paddingTop: getPadding('top'),
        paddingBottom: getPadding('bottom'),
        paddingRight: getPadding('right'),
        paddingLeft: getPadding('left'),
      }}>
      {icon ? (
        <Image
          source={icon}
          style={{
            height: size === 'small' || size === 'tiny' ? 12 : 19,
            width: size === 'small' || size === 'tiny' ? 12 : 19,
          }}
        />
      ) : (
        <>
          {prependIcon && (
            <Image
              source={prependIcon}
              style={{...styles.inlineIcon, marginRight: 12}}
            />
          )}
          <Text
            style={{
              ...styles.text,
              color: getColor(),
              fontSize: getFontSize(),
              lineHeight: getLineHeight(),
            }}>
            {children}
          </Text>
          {appendIcon && (
            <Image
              source={appendIcon}
              style={{...styles.inlineIcon, marginLeft: 12}}
            />
          )}
        </>
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
  text: {
    fontWeight: '500',
  },
  inlineIcon: {
    height: 12,
    width: 12,
  },
});

export default Button;
