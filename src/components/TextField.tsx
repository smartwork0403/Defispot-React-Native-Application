import React from 'react';
import {Image, TextInput, View, StyleSheet} from 'react-native';

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
  icon,
  placeholder,
  autoFocus,
}) => {
  return (
    <View style={styles.container}>
      {icon && (
        <Image
          source={require('../assets/images/sample.png')}
          style={styles.icon}
        />
      )}
      <TextInput
        onChangeText={onChangeText}
        value={value}
        style={styles.input}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
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
  },
});

export default TextField;
