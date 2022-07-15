import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, SafeAreaView} from 'react-native';

import StarSvg from '../assets/icons/star-outlined.svg';

import AssetsList from '../components/AssetsList';
import MarketsStats from '../components/MarketsStats';
import Button from '../components/Button';
import Select from '../components/Select';

import ChartSvg from '../assets/icons/chart.svg';
import ArrowUpSvg from '../assets/icons/arrow-up.svg';
import ArrowDownSvg from '../assets/icons/arrow-down.svg';
import CursorTextSvg from '../assets/icons/cursor-text.svg';
import DollarCircleSvg from '../assets/icons/dollar-circle.svg';
import Header from '../components/Header';

const sortByItems = [
  {
    name: 'volume',
    label: 'volume',
    icon: ChartSvg,
  },
  {
    name: 'gainers',
    label: 'Gainers',
    icon: ArrowUpSvg,
  },
  {
    name: 'losers',
    label: 'Losers',
    icon: ArrowDownSvg,
  },
  {
    name: 'name',
    label: 'Name',
    icon: CursorTextSvg,
  },
  {
    name: 'price',
    label: 'Price',
    icon: DollarCircleSvg,
  },
];

const MarketsScreen: React.FC = () => {
  const [sortBy, setSortBy] = useState('volume');
  const [isSearchShown, setIsSearchShown] = useState(false);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <Header
          title="Markets"
          searchable={{
            isShown: isSearchShown,
            onSearchToggle: isShown => setIsSearchShown(isShown),
          }}
          card={<MarketsStats />}
        />

        {!isSearchShown && (
          <View style={styles.filters}>
            <View style={styles.filter}>
              <Button accent="black" size="small">
                All
              </Button>
            </View>
            <View style={styles.filter}>
              <Button size="small" icon={StarSvg} />
            </View>
            <View style={styles.filter}>
              <Button size="small">Layer 1</Button>
            </View>
            <View style={styles.filter}>
              <Button size="small">DeFi</Button>
            </View>
            <Select
              header={{
                title: 'Sort by',
                actionLabel: 'Reset',
                onHeaderActionPress: () => setSortBy('volume'),
              }}
              items={sortByItems}
              selected={sortBy}
              onSelect={name => setSortBy(name)}
              label="Sort by"
              size="small"
            />
          </View>
        )}

        <AssetsList />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },

  filters: {
    paddingRight: 24,
    paddingLeft: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  filter: {
    marginRight: 12,
  },
});

export default MarketsScreen;
