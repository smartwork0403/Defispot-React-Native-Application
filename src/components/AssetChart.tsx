import React, {useState} from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';

import Select from './Select';

import PieSvg from '../assets/icons/pie-chart.svg';
import ChartSvg from '../assets/icons/chart.svg';

const sortByItems = [
  {
    name: '1m',
    label: '1 minute',
  },
  {
    name: '5m',
    label: '5 minutes',
  },
  {
    name: '15m',
    label: '15 minutes',
  },
  {
    name: '30m',
    label: '30 minutes',
  },
  {
    name: '1h',
    label: '1 Hour',
  },
  {
    name: '4h',
    label: '4 Hours',
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
          label="30 Min"
          size="small"
          outlined
        />
      </View>

      <Image
        source={require('../assets/images/sample-asset-chart.png')}
        style={{width: '100%', height: 275}}
        resizeMode={'contain'}
      />
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
