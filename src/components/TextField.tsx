import React from 'react';
import {TextInput, View, StyleSheet} from 'react-native';

interface Props {
  onChangeText?: ((text: string) => void) | undefined;
  value?: string | undefined;
  icon?: any;
  placeholder?: string;
  autoFocus?: boolean;
}

const TextField: React.FC<Props> = ({
  onChangeText,
  value,
  icon: Icon,
  placeholder,
  autoFocus,
}) => {
  return (
    <View style={styles.container}>
      {Icon && <Icon style={styles.icon} color="#A1A1A8" />}
      <TextInput
        onChangeText={onChangeText}
        value={value}
        style={styles.input}
        placeholder={placeholder}
        autoFocus={autoFocus}
        placeholderTextColor="#A1A1A8"
      />
    </View>
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
    backgroundColor: '#F7F8FA',
    borderRadius: 24,
    flex: 1,
    display: 'flex',
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
