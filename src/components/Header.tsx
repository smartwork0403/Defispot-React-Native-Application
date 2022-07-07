import React from 'react';
import {View, StyleSheet} from 'react-native';
import CustomText from './CustomText';

interface Props {
  title: string;
  action?: React.ReactNode;
}

const Header: React.FC<Props> = ({title, action}) => {
  return (
    <View style={styles.header}>
      <CustomText style={styles.title}>{title}</CustomText>
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
    fontFamily: 'Inter-Bold',
  },
});

export default Header;
