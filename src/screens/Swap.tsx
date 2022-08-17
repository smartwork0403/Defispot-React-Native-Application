import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {VictoryPie} from 'victory-native';
import type {
  RootStackParamList,
  TradeStackParamList,
} from '../components/Navigation';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {colors, globalStyles} from '../styles';

import Button from '../components/Button';
import CustomText from '../components/CustomText';
import Layout from '../components/Layout';
import TradeCompleteModal from '../components/TradeCompleteModal';
import TradeConfirmModal from '../components/TradeConfirmModal';
import TradeModule from '../components/TradeModule';
import ToggleBar from '../components/ToggleBar';

import {toggles} from './Deposit';

const Swap: React.FC = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<TradeStackParamList & RootStackParamList>
    >();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  return (
    <Layout
      accent="white"
      header={{
        minimal: {
          title: 'Swap',
        },
      }}
      footer={
        <View>
          <View style={styles.toggleBarContainer}>
            <ToggleBar
              selected="Swap"
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
      <View style={{...globalStyles.wrapper}}>
        <View style={{...styles.slippage, ...globalStyles.shadow}}>
          <CustomText>Slippage</CustomText>
          <CustomText weight="medium" style={styles.slippagePercent}>
            12%
          </CustomText>
          <Button text onPress={() => setIsCompleteModalOpen(true)}>
            Edit
          </Button>
        </View>

        <TradeModule />

        <View style={styles.details}>
          <View style={styles.detail}>
            <CustomText style={styles.detailTitle}>Equity</CustomText>
            <CustomText weight="medium">$0,00</CustomText>
          </View>
          <View style={styles.detail}>
            <CustomText style={styles.detailTitle}>Buying Power</CustomText>
            <CustomText weight="medium">$99,99</CustomText>
          </View>
          <View style={styles.detail}>
            <CustomText style={styles.detailTitle}>Margin Usage</CustomText>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <CustomText weight="medium" style={{marginRight: 8}}>
                7,83%
              </CustomText>
              <VictoryPie
                height={16}
                width={16}
                data={[
                  {x: 'filled', y: 50},
                  {x: 'unfilled', y: 50},
                ]}
                colorScale={[colors.blue, colors.neutral200]}
                labels={() => null}
                padding={0}
                innerRadius={5}
              />
            </View>
          </View>

          <Button disabled style={styles.action} accent="black">
            Preview Swap
          </Button>
        </View>
      </View>

      <TradeConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
      />
      <TradeCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  slippage: {
    backgroundColor: colors.neutral0,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 16,
    paddingLeft: 16,
    marginBottom: 16,
  },
  slippagePercent: {
    fontSize: 12,
    lineHeight: 16,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 8,
    paddingLeft: 8,
    marginLeft: 4,
    backgroundColor: colors.neutral50,
    marginRight: 'auto',
    borderRadius: 100,
  },
  details: {
    marginTop: 16,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailTitle: {
    color: colors.neutral500,
    marginRight: 16,
  },
  action: {
    marginTop: 8,
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

export default Swap;
