import React, {useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {VictoryAxis, VictoryCandlestick, VictoryChart} from 'victory-native';

import Select from './Select';

import PieSvg from '../assets/icons/pie-chart.svg';
import ChartSvg from '../assets/icons/chart.svg';

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
              backgroundColor: isChartActive ? '#fff' : 'transparent',
            }}>
            <ChartSvg
              height={15}
              width={15}
              color={isChartActive ? '#121315' : '#8D8D94'}
            />
          </View>
          <View
            style={{
              ...styles.headerSwitchIconContainer,
              backgroundColor: isChartActive ? 'transparent' : '#fff',
            }}>
            <PieSvg
              height={15}
              width={15}
              color={isChartActive ? '#8D8D94' : '#121315'}
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
              fill: '#A1A1A8',
              fontFamily: 'Inter-Medium',
            },
          }}
        />
        <VictoryCandlestick
          candleColors={{positive: '#00B674', negative: '#EF4444'}}
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

      <View style={{backgroundColor: 'lightblue'}}>
        {/*  <VictoryChart>
          <VictoryAxis
            style={{
              axis: {stroke: 'red'},
              grid: {stroke: 'red'},
              tickLabels: {
                fontSize: 11,
                padding: 8,
                fill: '#A1A1A8',
                fontFamily: 'Inter-Medium',
              },
            }}
          />
        </VictoryChart> */}

        {/* <VictoryBar
          // standalone={false}
          // height={50}
          padding={0}
          data={[
            {x: 1, y: 2},
            {x: 2, y: 3},
            {x: 3, y: 5},
            {x: 4, y: 4},
            {x: 5, y: 6},
            {x: 5, y: 6},
            {x: 5, y: 6},
            {x: 5, y: 6},
            {x: 5, y: 6},
            {x: 5, y: 6},
            {x: 5, y: 6},
            {x: 5, y: 6},
            {x: 5, y: 6},
          ]}
        /> */}
      </View>

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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerSwitch: {
    backgroundColor: '#EFF0F3',
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
});

export default AssetChart;
