import React from 'react';
import {View, StyleSheet} from 'react-native';
import {VictoryPie} from 'victory-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {colors, fonts} from '../styles';

import type {RootStackParamList} from '../components/Navigation';
import CustomText from '../components/CustomText';
import Button from '../components/Button';
import WalletsList from '../components/WalletsList';
import Layout from '../components/Layout';
import NoWalletConnected from '../components/NoWalletConnected';
import Card from '../components/Card';

import ArrowUpSvg from '../assets/icons/arrow-up.svg';
import ArrowDownSvg from '../assets/icons/arrow-down.svg';
import RefreshSvg from '../assets/icons/refresh.svg';

const NoWallet: React.FC = () => {
  return (
    <View style={noWalletStyles.noWallet}>
      <NoWalletConnected />
      <View style={noWalletStyles.noWalletListContainer}>
        <WalletsList />
        <View style={noWalletStyles.noWalletListOverlay} />
      </View>
    </View>
  );
};

const noWalletStyles = StyleSheet.create({
  noWallet: {
    flex: 1,
  },
  noWalletListContainer: {
    paddingBottom: 8,
    marginTop: -80,
  },
  noWalletListOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.neutral50,
    opacity: 0.91,
  },
});

const Banner: React.FC<{noData: boolean}> = ({noData}) => {
  return (
    <Card style={styles.banner}>
      <CustomText style={styles.headerCardTitle}>
        Total Net USD Value
      </CustomText>
      <View style={styles.headerCardValue}>
        <CustomText style={styles.headerCardValueSign}>$</CustomText>
        <CustomText style={styles.headerCardValueText}>
          {noData ? '0.00' : '3,564.00'}
        </CustomText>
      </View>
    </Card>
  );
};

const WalletScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const noData = false;

  const chartData = [
    {
      label: 'BTC',
      value: 20,
      color: colors.blue,
    },
    {
      label: 'USD',
      value: 48,
      color: colors.neutral100,
    },
    {
      label: 'FTT',
      value: 32,
      color: colors.neutral200,
    },
  ];

  return (
    <Layout
      contentStyle={{paddingTop: 0}}
      header={{
        title: 'Wallet',
        action: {
          type: 'text',
          text: 'History',
          onActionPress: () => navigation.navigate('History'),
        },
        extended: true,
      }}>
      {noData ? (
        <>
          <Banner noData={noData} />
          <NoWallet />
        </>
      ) : (
        <>
          <Banner noData={noData} />

          <View style={styles.actions}>
            <Button
              prependIcon={{icon: ArrowUpSvg}}
              size="small"
              shadow
              accent="white"
              style={{marginRight: 8}}>
              Deposit
            </Button>
            <Button
              prependIcon={{icon: ArrowDownSvg}}
              size="small"
              shadow
              accent="white"
              style={{marginRight: 8}}>
              Withdraw
            </Button>
            <Button
              prependIcon={{icon: RefreshSvg}}
              accent="white"
              size="small"
              shadow>
              Convert
            </Button>
          </View>

          <View style={styles.chart}>
            <VictoryPie
              height={152}
              width={152}
              data={chartData.map(data => ({
                x: data.label,
                y: data.value,
              }))}
              colorScale={chartData.map(data => data.color)}
              labels={() => null}
              padding={0}
              innerRadius={42}
            />

            <View style={styles.legends}>
              {chartData.map((data, i) => (
                <View
                  key={data.label}
                  style={{
                    ...styles.legend,
                    marginBottom: i + 1 !== chartData.length ? 6 : 0,
                  }}>
                  <View
                    style={{...styles.legendIcon, backgroundColor: data.color}}
                  />
                  <CustomText weight="medium" style={styles.legendValue}>
                    {data.value}%
                  </CustomText>
                  <CustomText style={styles.legendName}>
                    {data.label}
                  </CustomText>
                </View>
              ))}
            </View>
          </View>

          <WalletsList />
        </>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerCardTitle: {
    color: colors.neutral400,
    fontFamily: fonts.circularStd,
  },
  headerCardValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCardValueSign: {
    color: colors.neutral300,
    marginRight: 4,
    fontFamily: fonts.circularStdMedium,
    fontSize: 32,
    lineHeight: 40,
  },
  headerCardValueText: {
    fontFamily: fonts.circularStdMedium,
    fontSize: 40,
    lineHeight: 48,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  chart: {
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  legends: {},
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 40,
  },
  legendIcon: {
    height: 8,
    width: 8,
    borderRadius: 8 / 2,
    marginRight: 12,
  },
  legendValue: {
    marginRight: 5,
  },
  legendName: {
    color: colors.neutral500,
  },
});

export default WalletScreen;
