import React, {type PropsWithChildren} from 'react';
import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';

const Button: React.FC<
  PropsWithChildren<{
    onPress?: ((event: GestureResponderEvent) => void) | undefined;
    accent?: 'black' | 'blue';
    size?: 'small' | 'tiny';
    noOutline?: boolean;
    icon?: any;
  }>
> = ({children, onPress, accent, size, noOutline = false, icon: Icon}) => {
  const getBgColor = () => {
    if (noOutline) {
      return 'transparent';
    }

    if (accent === 'black') {
      return '#121315';
    } else if (accent === 'blue') {
      return '#0077FF';
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
    if (accent === 'blue') {
      return '#0077FF';
    }
    return '#ffff';
  };
  const getPadding = (side: string) => {
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
    if (accent === 'black' || accent === 'blue') {
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
    <DropShadow
      style={{
        shadowColor: '#8d8d94',
        shadowOffset: {width: 2, height: 4},
        shadowRadius: 8,
        shadowOpacity: 0.06,
      }}>
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
          <Text
            style={{
              ...styles.text,
              color: getColor(),
              fontSize: getFontSize(),
              lineHeight: getLineHeight(),
            }}>
            {children}
          </Text>
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
  text: {
    fontFamily: 'Inter-Medium',
  },
});

export default Button;
