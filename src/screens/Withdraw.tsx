import React from 'react';
import {View, StyleSheet} from 'react-native';
import type {
  RootStackParamList,
  TradeStackParamList,
} from '../components/Navigation';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ToggleBar from '../components/ToggleBar';

import {colors} from '../styles';

import CustomText from '../components/CustomText';
import Layout from '../components/Layout';

import {toggles} from './Deposit';

const Withdraw: React.FC = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<TradeStackParamList & RootStackParamList>
    >();

  return (
    <Layout
      accent="white"
      header={{
        minimal: {
          title: 'Withdraw',
        },
      }}
      footer={
        <View>
          <View style={styles.footerInfoContainer}>
            <CustomText style={styles.footerInfo} weight="medium">
              Crypto withdrawals will take up to 24 hours to be processed.
            </CustomText>
          </View>

          <View style={styles.toggleBarContainer}>
            <ToggleBar
              selected="Withdraw"
              items={toggles}
              onChange={value => {
                if (
                  value === 'Deposit' ||
                  value === 'Swap' ||
                  value === 'Withdraw'
                ) {
                  navigation.navigate(value);
                }
              }}
            />
          </View>
        </View>
      }></Layout>
  );
};

const styles = StyleSheet.create({
  footerInfoContainer: {
    borderBottomColor: colors.neutral100,
    borderBottomWidth: 1,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 8,
    paddingLeft: 8,
    backgroundColor: colors.neutral0,
  },
  footerInfo: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.neutral400,
    textAlign: 'center',
  },
  toggleBarContainer: {
    backgroundColor: colors.neutral0,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 16,
    paddingLeft: 16,
    borderBottomColor: colors.neutral100,
    borderBottomWidth: 1,
  },
});

export default Withdraw;
