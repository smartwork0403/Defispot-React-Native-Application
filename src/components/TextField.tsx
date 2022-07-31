import React, {useState} from 'react';
import {TextInput, View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import DropShadow from 'react-native-drop-shadow';

interface Props {
  onChangeText?: ((text: string) => void) | undefined;
  value?: string | undefined;
  icon?: any;
  placeholder?: string;
  autoFocus?: boolean;
  shadowStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  onFocus?: () => void;
  onBlur?: () => void;
}

const TextField: React.FC<Props> = ({
  onChangeText,
  value,
  icon: Icon,
  placeholder,
  autoFocus,
  shadowStyle,
  style,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <DropShadow style={[shadowStyle, {flex: 1}]}>
      <View
        style={[
          styles.container,
          {borderColor: isFocused ? '#0077FF' : 'transparent'},
          style,
        ]}>
        {Icon && (
          <Icon style={styles.icon} color={isFocused ? '#0077FF' : '#A1A1A8'} />
        )}
        <TextInput
          onChangeText={onChangeText}
          value={value}
          style={styles.input}
          placeholder={placeholder}
          autoFocus={autoFocus}
          placeholderTextColor="#A1A1A8"
          onFocus={() => {
            onFocus?.();
            setIsFocused(true);
          }}
          onBlur={() => {
            onBlur?.();
            setIsFocused(false);
          }}
        />
      </View>
    </DropShadow>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 12,
    paddingLeft: 13,
    backgroundColor: '#fff',
    borderRadius: 24,
    flex: 1,
    display: 'flex',
    borderWidth: 1,
  },
  icon: {
    height: 15,
    width: 15,
    marginRight: 13,
  },
  input: {
    fontSize: 14,
    lineHeight: 24,
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    fontFamily: 'Inter-Regular',
  },
});

export default TextField;
