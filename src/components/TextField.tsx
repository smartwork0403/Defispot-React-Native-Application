import React, {useState, forwardRef} from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
} from 'react-native';

import {colors, fonts, globalStyles} from '../styles';

import CustomText from './CustomText';
import Button from './Button';

import EyeSvg from '../assets/icons/eye.svg';
import EyeOffSvg from '../assets/icons/eye-off.svg';

interface Props {
  onChangeText?: (text: string) => void;
  value?: string;
  prependIcon?: {icon: any; width?: number; height?: number; color?: string};
  appendIcon?: {icon: any; width?: number; height?: number; color?: string};
  appendAction?: {label: string; onPress: () => void};
  onAppendIconPress?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  shadow?: boolean;
  style?: StyleProp<ViewStyle>;
  onFocus?: () => void;
  onBlur?: () => void;
  size?: 'small';
  label?: string;
  accent?: 'grey';
  type?: 'password';
  textarea?: boolean;
  noOutline?: boolean;
}

const TextField = forwardRef<TextInput, Props>(
  (
    {
      onChangeText,
      value,
      prependIcon,
      appendIcon,
      appendAction,
      onAppendIconPress,
      placeholder,
      autoFocus,
      shadow,
      style,
      onFocus,
      onBlur,
      size,
      label,
      accent,
      type,
      textarea,
      noOutline,
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordShown, setIsPasswordShown] = useState(false);

    const getStyles = () => {
      let customStyles: StyleProp<ViewStyle> = {};

      if (isFocused) {
        customStyles.borderColor = colors.blue;
      } else {
        if (noOutline) {
          customStyles.borderColor = colors.neutral0;
        } else {
          customStyles.borderColor = colors.neutral200;
        }
      }

      customStyles.backgroundColor = colors.neutral0;

      if (accent === 'grey') {
        customStyles.borderColor = colors.neutral50;
        customStyles.backgroundColor = colors.neutral50;
      }

      customStyles.paddingTop = 10;
      customStyles.paddingBottom = 10;
      customStyles.paddingLeft = 16;
      customStyles.paddingRight = 16;

      if (prependIcon) {
        customStyles.paddingLeft = 10;
      }

      if (appendIcon || type === 'password') {
        customStyles.paddingRight = 10;
      }

      if (size === 'small') {
        customStyles.paddingTop = 6;
        customStyles.paddingBottom = 6;
        customStyles.paddingLeft = 12;
        customStyles.paddingRight = 12;

        if (prependIcon) {
          customStyles.paddingLeft = 6;
        }

        if (appendIcon || type === 'password') {
          customStyles.paddingRight = 6;
        }
      }

      if (shadow) {
        customStyles = Object.assign(customStyles, globalStyles.shadow);
      }

      if (textarea) {
        customStyles.borderRadius = 12;
        customStyles.minHeight = 90;
        customStyles.alignItems = 'flex-start';
      }

      return customStyles;
    };

    return (
      <View style={style}>
        {label && (
          <CustomText weight="medium" style={styles.label}>
            {label}
          </CustomText>
        )}

        <View style={[styles.inputContainer, getStyles()]}>
          {prependIcon && (
            <View style={[styles.iconContainer, {marginRight: 8}]}>
              <prependIcon.icon
                height={prependIcon.width ?? 15}
                width={prependIcon.width ?? 15}
                color={
                  prependIcon.color ?? isFocused
                    ? accent !== 'grey'
                      ? colors.blue
                      : colors.neutral400
                    : colors.neutral400
                }
              />
            </View>
          )}
          <TextInput
            multiline={textarea}
            numberOfLines={textarea ? 4 : 1}
            secureTextEntry={type === 'password' ? !isPasswordShown : false}
            ref={ref}
            onChangeText={onChangeText}
            value={value}
            style={[
              styles.input,
              {
                textAlignVertical: textarea ? 'top' : 'center',
              },
            ]}
            placeholder={placeholder}
            autoFocus={autoFocus}
            placeholderTextColor={colors.neutral500}
            onFocus={() => {
              onFocus?.();
              setIsFocused(true);
            }}
            onBlur={() => {
              onBlur?.();
              setIsFocused(false);
            }}
          />
          {type === 'password' ? (
            <Pressable
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={[styles.iconContainer, {marginLeft: 8}]}>
              {isPasswordShown ? (
                <EyeOffSvg height={15} width={15} color={colors.neutral900} />
              ) : (
                <EyeSvg height={15} width={15} color={colors.neutral900} />
              )}
            </Pressable>
          ) : (
            <>
              {appendIcon && (
                <Pressable
                  onPress={onAppendIconPress}
                  style={[styles.iconContainer, {marginLeft: 8}]}>
                  <appendIcon.icon
                    height={appendIcon.width ?? 15}
                    width={appendIcon.width ?? 15}
                    color={appendIcon.color ?? colors.neutral400}
                  />
                </Pressable>
              )}
              {appendAction && (
                <Button
                  style={{marginLeft: 8}}
                  onPress={appendAction.onPress}
                  text>
                  {appendAction.label}
                </Button>
              )}
            </>
          )}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    // flex: 1,
    display: 'flex',
    borderWidth: 1,
  },
  iconContainer: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontSize: 14,
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    fontFamily: fonts.inter,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 0,
  },
});

export default TextField;
