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

import {toggles} from './Deposit';

const assetItems = [
  {
    icon: require('../assets/images/sample.png'),
    title: 'BTC',
    info: 'Bitcoin',
    append: '$12,400.00',
    value: 'btc',
  },
  {
    icon: require('../assets/images/sample.png'),
    title: 'LINK',
    info: 'Chainlink',
    append: '$2,324.00',
    value: 'link',
  },
  {
    icon: require('../assets/images/sample.png'),
    title: 'BCH',
    info: 'Bitcoin Cash',
    append: '$0.00',
    value: 'bch',
  },
];

const Withdraw: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

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
      }>
      <Select
        items={assetItems}
        title="Select a token"
        searchPlaceholder="Search all assets"
        label="Select Asset"
        selected={selectedAsset}
        onChange={value => setSelectedAsset(value)}
      />
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
});

export default Withdraw;
