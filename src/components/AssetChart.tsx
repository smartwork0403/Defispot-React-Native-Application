import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {
  VictoryAxis,
  VictoryCandlestick,
  VictoryChart,
  VictoryLine,
} from 'victory-native';
import {colors, fonts} from '../styles';

import Select from './Select';

import PieSvg from '../assets/icons/pie-chart.svg';
import ChartSvg from '../assets/icons/chart.svg';
import CustomText from './CustomText';

const sortByItems = [
  {
    name: '1m',
    label: '1 minute',
    shortLabel: '1 Min',
  },
  {
    name: '5m',
    label: '5 minutes',
    shortLabel: '5 Min',
  },
  {
    name: '15m',
    label: '15 minutes',
    shortLabel: '15 Min',
  },
  {
    name: '30m',
    label: '30 minutes',
    shortLabel: '30 Min',
  },
  {
    name: '1h',
    label: '1 Hour',
    shortLabel: '1 Hour',
  },
  {
    name: '4h',
    label: '4 Hours',
    shortLabel: '4 Hours',
  },
];

const AssetChart: React.FC = () => {
  const [isChartActive, setIsChartActive] = useState(true);
  const [sortBy, setSortBy] = useState('30m');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerSwitch}
          onPress={() => setIsChartActive(!isChartActive)}>
          <View
            style={{
              ...styles.headerSwitchIconContainer,
              backgroundColor: isChartActive ? colors.neutral0 : 'transparent',
            }}>
            <ChartSvg
              height={15}
              width={15}
              color={isChartActive ? colors.neutral900 : colors.neutral500}
            />
          </View>
          <View
            style={{
              ...styles.headerSwitchIconContainer,
              backgroundColor: isChartActive ? 'transparent' : colors.neutral0,
            }}>
            <PieSvg
              height={15}
              width={15}
              color={isChartActive ? colors.neutral500 : colors.neutral900}
            />
          </View>
        </Pressable>

        <Select
          header={{
            title: 'Time-Frame',
            actionLabel: 'Reset',
            onHeaderActionPress: () => setSortBy('30m'),
          }}
          items={sortByItems}
          selected={sortBy}
          onSelect={name => setSortBy(name)}
          label={
            sortByItems.find(item => item.name === sortBy)?.shortLabel ?? sortBy
          }
          size="small"
          outlined
        />
      </View>

      {isChartActive ? (
        <VictoryChart
          height={208}
          padding={{left: 44, right: 40, top: 10, bottom: 0}}>
          <VictoryAxis
            dependentAxis
            style={{
              axis: {stroke: 'transparent'},
              grid: {stroke: 'transparent'},
              tickLabels: {
                fontSize: 11,
                padding: 24,
                fill: colors.neutral400,
                fontFamily: fonts.interMedium,
              },
            }}
          />
          <VictoryCandlestick
            candleColors={{positive: colors.green, negative: colors.red}}
            style={{data: {stroke: 'transparent', strokeWidth: 1}}}
            data={[
              {x: new Date(2016, 6, 1), open: 5, close: 10, high: 15, low: 0},
              {x: new Date(2016, 6, 2), open: 10, close: 15, high: 20, low: 5},
              {x: new Date(2016, 6, 3), open: 15, close: 20, high: 22, low: 10},
              {x: new Date(2016, 6, 4), open: 20, close: 10, high: 25, low: 7},
              {x: new Date(2016, 6, 5), open: 10, close: 8, high: 15, low: 5},
              {x: new Date(2016, 6, 6), open: 10, close: 8, high: 15, low: 5},
              {x: new Date(2016, 6, 7), open: 10, close: 8, high: 15, low: 5},
              {x: new Date(2016, 6, 8), open: 10, close: 8, high: 15, low: 5},
              {x: new Date(2016, 6, 9), open: 10, close: 8, high: 15, low: 5},
              {x: new Date(2016, 6, 10), open: 10, close: 8, high: 15, low: 5},
              {x: new Date(2016, 6, 11), open: 10, close: 8, high: 15, low: 5},
              {x: new Date(2016, 6, 12), open: 10, close: 8, high: 15, low: 5},
              {x: new Date(2016, 6, 13), open: 10, close: 8, high: 15, low: 5},
              {x: new Date(2016, 6, 14), open: 10, close: 8, high: 15, low: 5},
              {x: new Date(2016, 6, 15), open: 10, close: 8, high: 15, low: 5},
              {x: new Date(2016, 6, 16), open: 10, close: 8, high: 15, low: 5},
              {x: new Date(2016, 6, 17), open: 10, close: 8, high: 15, low: 5},
              {x: new Date(2016, 6, 18), open: 10, close: 8, high: 15, low: 5},
              {x: new Date(2016, 6, 19), open: 10, close: 8, high: 15, low: 5},
              {x: new Date(2016, 6, 20), open: 10, close: 8, high: 15, low: 5},
              {x: new Date(2016, 6, 21), open: 10, close: 8, high: 15, low: 5},
              {
                x: new Date(2016, 6, 22),
                open: 10,
                close: 8,
                high: 20,
                low: 5,
              },
            ]}
          />
        </VictoryChart>
      ) : (
        <View style={styles.lineCartContainer}>
          <View style={styles.lineChartData}>
            <CustomText style={styles.lineChartDataLabel}>
              Viewing data for
            </CustomText>
            <CustomText weight="medium">28.06.22, 2:00 PM</CustomText>
          </View>

          <View style={styles.lineChartInfoContainer}>
            <View style={styles.lineChartInfo}>
              <CustomText style={styles.lineChartInfoLabel} weight="medium">
                O
              </CustomText>
              <CustomText weight="medium" style={styles.lineChartInfoValue}>
                50,5
              </CustomText>
            </View>
            <View style={styles.lineChartInfoDivider} />
            <View style={styles.lineChartInfo}>
              <CustomText style={styles.lineChartInfoLabel} weight="medium">
                H
              </CustomText>
              <CustomText style={styles.lineChartInfoValue}>51,0</CustomText>
            </View>
            <View style={styles.lineChartInfoDivider} />
            <View style={styles.lineChartInfo}>
              <CustomText style={styles.lineChartInfoLabel} weight="medium">
                L
              </CustomText>
              <CustomText style={styles.lineChartInfoValue}>50,1</CustomText>
            </View>
            <View style={styles.lineChartInfoDivider} />
            <View style={styles.lineChartInfo}>
              <CustomText style={styles.lineChartInfoLabel} weight="medium">
                C
              </CustomText>
              <CustomText style={styles.lineChartInfoValue}>50,6</CustomText>
            </View>
            <View style={styles.lineChartInfoDivider} />
            <View style={styles.lineChartInfo}>
              <CustomText style={styles.lineChartInfoLabel} weight="medium">
                V
              </CustomText>
              <CustomText style={styles.lineChartInfoValue}>684</CustomText>
            </View>
          </View>

          <VictoryChart
            height={236}
            padding={{left: 44, right: 40, top: 10, bottom: 30}}>
            <VictoryAxis
              dependentAxis
              style={{
                axis: {stroke: 'transparent'},
                grid: {stroke: 'transparent'},
                tickLabels: {
                  fontSize: 11,
                  padding: 24,
                  fill: colors.neutral400,
                  fontFamily: fonts.interMedium,
                },
              }}
            />
            <VictoryAxis
              style={{
                axis: {stroke: 'transparent'},
                grid: {stroke: 'transparent'},
                tickLabels: {
                  fontSize: 11,
                  padding: 12,
                  fill: colors.neutral400,
                  fontFamily: fonts.interMedium,
                },
              }}
            />
            <VictoryLine
              style={{data: {stroke: colors.green}}}
              data={[
                {x: 1, y: null},
                {x: 2, y: null},
                {x: 3, y: null},
                {x: 4, y: 6},
                {x: 5, y: 10},
                {x: 6, y: 6},
                {x: 7, y: null},
                {x: 8, y: null},
                {x: 9, y: 6},
                {x: 10, y: 12},
              ]}
            />
            <VictoryLine
              style={{data: {stroke: colors.red}}}
              data={[
                {x: 1, y: 1},
                {x: 2, y: 5},
                {x: 3, y: 4},
                {x: 4, y: 6},
                {x: 5, y: null},
                {x: 6, y: 6},
                {x: 7, y: 2},
                {x: 8, y: 5},
                {x: 9, y: 6},
                {x: 10, y: null},
              ]}
            />
          </VictoryChart>
        </View>
      )}

      {/* <Image
        source={require('../assets/images/sample-asset-chart.png')}
        style={{width: '100%', height: 275}}
        resizeMode={'contain'}
      />
      <Image
        source={require('../assets/images/sample-asset-chart-1.png')}
        style={{width: '100%', height: 275}}
        resizeMode={'contain'}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.neutral0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerSwitch: {
    backgroundColor: colors.neutral100,
    borderRadius: 24,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSwitchIconContainer: {
    height: 32,
    width: 32,
    borderRadius: 32 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineCartContainer: {},
  lineChartData: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  lineChartDataLabel: {
    color: colors.neutral400,
    marginRight: 5,
  },
  lineChartInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  lineChartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineChartInfoLabel: {
    fontSize: 12,
    lineHeight: 16,
    marginRight: 4,
    color: colors.neutral400,
  },
  lineChartInfoValue: {
    color: colors.green,
    fontSize: 12,
    lineHeight: 16,
  },
  lineChartInfoDivider: {
    height: 8,
    width: 1,
    backgroundColor: colors.neutral200,
    marginLeft: 16,
    marginRight: 16,
  },
});

export default AssetChart;
