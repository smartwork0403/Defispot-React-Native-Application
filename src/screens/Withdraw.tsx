import React, {useState} from 'react';
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
import Select from '../components/Select';
import TextField from '../components/TextField';
import Button from '../components/Button';

import FileScanSVG from '../assets/icons/file-scan.svg';

import {toggles} from './Deposit';

const Withdraw: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);

  const navigation =
    useNavigation<
      NativeStackNavigationProp<TradeStackParamList & RootStackParamList>
    >();

  return (
    <Layout
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
      }>
      <Select
        type="asset"
        label="Select Asset"
        selected={selectedAsset}
        onChange={value => setSelectedAsset(value)}
        style={{marginBottom: 16}}
      />
      <Select
        type="network"
        label="Deposit Network"
        selected={selectedNetwork}
        onChange={value => setSelectedNetwork(value)}
        style={{marginBottom: 16}}
      />
      <TextField
        label="Amount"
        placeholder="0.0000"
        style={{marginBottom: 16}}
        appendAction={{label: 'Max', onPress: () => {}}}
      />
      <TextField
        label="Recipient Address"
        placeholder="Recipient Address"
        appendIcon={{icon: FileScanSVG}}
        style={{marginBottom: 16}}
      />

      <View style={styles.detail}>
        <CustomText style={styles.detailTitle}>DefiSpot Fee</CustomText>
        <CustomText weight="medium">0,00</CustomText>
      </View>
      <View style={[styles.detail, {marginBottom: 16}]}>
        <CustomText style={styles.detailTitle}>Total</CustomText>
        <CustomText weight="medium">0,00</CustomText>
      </View>

      <Button size="large" disabled>
        Withdraw
      </Button>
    </Layout>
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
  detail: {
    marginBottom: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailTitle: {
    color: colors.neutral500,
  },
});

export default Withdraw;
