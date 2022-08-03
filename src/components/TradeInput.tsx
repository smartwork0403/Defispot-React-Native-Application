import React, {useState} from 'react';
import {View, StyleSheet, TextInput, Pressable, Image} from 'react-native';

import {colors, fonts} from '../styles';

import CustomText from './CustomText';

import ChevronDownSvg from '../assets/icons/chevron-down.svg';

const FOCUS_STATE = {
  idle: 'idle',
  focused: 'focused',
  error: 'error',
};

const TradeInput: React.FC = () => {
  const [focusState, setFocusState] = useState(FOCUS_STATE.idle);

  const getBorderColor = () => {
    if (focusState === FOCUS_STATE.focused) {
      return colors.blue;
    } else if (focusState === FOCUS_STATE.error) {
      return colors.red;
    }

    return colors.neutral100;
  };

  return (
    <View style={{...styles.container, borderColor: getBorderColor()}}>
      <View style={styles.top}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onFocus={() => setFocusState(FOCUS_STATE.focused)}
            onBlur={() => setFocusState(FOCUS_STATE.idle)}
            placeholder="0.00"
            placeholderTextColor={colors.neutral300}
            keyboardType="number-pad"
          />
          <CustomText style={styles.price}>$0.00</CustomText>
        </View>

        <Pressable style={styles.assetPicker}>
          <Image
            source={require('../assets/images/sample.png')}
            style={styles.assetPickerIcon}
          />
          <CustomText weight="medium" style={styles.assetPickerText}>
            LINK
          </CustomText>
          <ChevronDownSvg width={10} color={colors.neutral400} />
        </Pressable>
      </View>

      <View style={styles.bottom}>
        <CustomText weight="medium" style={styles.bottomTextTitle}>
          Balance:
        </CustomText>
        <CustomText weight="medium" style={styles.bottomTextValue}>
          256
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: colors.neutral0,
  },
  top: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 20,
    paddingRight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: colors.neutral100,
    borderBottomWidth: 1,
  },
  inputContainer: {
    marginRight: 24,
    flex: 1,
  },
  input: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: fonts.interSemiBold,
    color: colors.neutral900,
  },
  price: {
    color: colors.neutral400,
  },
  assetPicker: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 17,
    borderRadius: 24,
    backgroundColor: colors.neutral100,
    flexDirection: 'row',
  },
  assetPickerIcon: {
    height: 20,
    width: 20,
    marginRight: 8,
    borderRadius: 20 / 2,
  },
  assetPickerText: {
    marginRight: 17,
  },
  bottom: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
  },
  bottomTextTitle: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.neutral500,
  },
  bottomTextValue: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.blue,
  },
});

export default TradeInput;
