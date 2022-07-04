import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

interface Props {
  title: string;
  action?: React.ReactNode;
}

const Header: React.FC<Props> = ({title, action}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {action}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'red',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Splash-Regular',
    color: '#121315',
  },
});

export default Header;
