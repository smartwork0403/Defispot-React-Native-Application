import React from 'react';
import {View, StyleSheet} from 'react-native';
import {VictoryPie} from 'victory-native';

import CustomText from '../components/CustomText';
import Button from '../components/Button';
import WalletsList from '../components/WalletsList';
import Layout from '../components/Layout';
import NoWalletConnected from '../components/NoWalletConnected';

import ArrowUpSvg from '../assets/icons/arrow-up.svg';
import ArrowDownSvg from '../assets/icons/arrow-down.svg';
import RefreshSvg from '../assets/icons/refresh.svg';
import {useNavigation} from '@react-navigation/native';

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
    padding: 16,
    paddingBottom: 8,
    marginTop: -80,
  },
  noWalletListOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F7F8FA',
    opacity: 0.91,
  },
});

const WalletScreen: React.FC = () => {
  const navigation = useNavigation();
  const noData = false;

  const chartData = [
    {
      label: 'BTC',
      value: 20,
      color: '#0077FF',
    },
    {
      label: 'USD',
      value: 48,
      color: '#EFF0F3',
    },
    {
      label: 'FTT',
      value: 32,
      color: '#E0E1E4',
    },
  ];

  return (
    <Layout
      header={{
        title: 'Wallet',
        action: {
          type: 'text',
          text: 'History',
          onActionPress: () => navigation.navigate('History'),
        },
        card: (
          <>
            <CustomText style={styles.headerCardTitle}>
              Total Net USD Value
            </CustomText>
            <View style={styles.headerCardValue}>
              <CustomText style={styles.headerCardValueSign}>$</CustomText>
              <CustomText style={styles.headerCardValueText}>
                {noData ? '0.00' : '3,564.00'}
              </CustomText>
            </View>
          </>
        ),
      }}
      contentStyle={
        noData
          ? {padding: 0}
          : {
              paddingBottom: 8,
            }
      }>
      {noData ? (
        <NoWallet />
      ) : (
        <>
          <View style={styles.actions}>
            <Button
              prependIcon={{icon: ArrowUpSvg}}
              size="small"
              shadowStyle={styles.actionShadowStyle}
              style={{marginRight: 8}}>
              Deposit
            </Button>
            <Button
              prependIcon={{icon: ArrowDownSvg}}
              size="small"
              shadowStyle={styles.actionShadowStyle}
              style={{marginRight: 8}}>
              Withdraw
            </Button>
            <Button
              prependIcon={{icon: RefreshSvg}}
              size="small"
              shadowStyle={styles.actionShadowStyle}>
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
                  <CustomText style={styles.legendValue}>
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
  },
  actionShadowStyle: {
    shadowColor: '#8d8d94',
    shadowOffset: {width: 2, height: 4},
    shadowRadius: 8,
    shadowOpacity: 0.06,
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
    fontFamily: 'Inter-Medium',
    marginRight: 5,
  },
  legendName: {
    color: '#8D8D94',
  },
});

export default WalletScreen;
