import React from 'react';
import {View, StyleSheet, ScrollView, SafeAreaView} from 'react-native';

import CustomText from '../components/CustomText';
import Header from '../components/Header';
import Button from '../components/Button';
import WalletsList from '../components/WalletsList';

import ArrowUpSvg from '../assets/icons/arrow-up.svg';
import ArrowDownSvg from '../assets/icons/arrow-down.svg';
import RefreshSvg from '../assets/icons/refresh.svg';
import SamplePieChartSvg from '../assets/icons/sample-pie-chart.svg';

const WalletScreen: React.FC = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <Header
          title="Wallet"
          action={{type: 'text', text: 'History'}}
          card={
            <>
              <CustomText style={styles.headerCardTitle}>
                Total Net USD Value
              </CustomText>
              <View style={styles.headerCardValue}>
                <CustomText style={styles.headerCardValueSign}>$</CustomText>
                <CustomText style={styles.headerCardValueText}>
                  3,564.00
                </CustomText>
              </View>
            </>
          }
        />
        <View style={styles.actions}>
          <Button
            prependIcon={ArrowUpSvg}
            size="small"
            style={{marginRight: 8}}>
            Deposit
          </Button>
          <Button
            prependIcon={ArrowDownSvg}
            size="small"
            style={{marginRight: 8}}>
            Withdraw
          </Button>
          <Button prependIcon={RefreshSvg} size="small">
            Convert
          </Button>
        </View>

        <View style={styles.chart}>
          <SamplePieChartSvg height={152} />
        </View>

        <WalletsList />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerCardTitle: {
    color: '#A1A1A8',
    fontFamily: 'CircularStd-Regular',
  },
  headerCardValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCardValueSign: {
    color: '#CFCED2',
    marginRight: 4,
    fontFamily: 'CircularStd-Medium',
    fontSize: 32,
    lineHeight: 40,
  },
  headerCardValueText: {
    fontFamily: 'CircularStd-Medium',
    fontSize: 40,
    lineHeight: 48,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingLeft: 16,
    paddingRight: 16,
  },
  chart: {
    marginBottom: 24,
  },
});

export default WalletScreen;
