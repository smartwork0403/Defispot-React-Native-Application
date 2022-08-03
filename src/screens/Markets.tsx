import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {colors} from '../styles';

import Layout from '../components/Layout';
import AssetsList from '../components/AssetsList';
import MarketsStats from '../components/MarketsStats';
import Button from '../components/Button';
import Select from '../components/Select';

import StarSvg from '../assets/icons/star-outlined-thick.svg';
import ChartSvg from '../assets/icons/chart.svg';
import ArrowUpSvg from '../assets/icons/arrow-up.svg';
import ArrowDownSvg from '../assets/icons/arrow-down.svg';
import CursorTextSvg from '../assets/icons/cursor-text.svg';
import DollarCircleSvg from '../assets/icons/dollar-circle.svg';

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
    <Layout
      header={{
        title: 'Markets',
        searchable: {
          isShown: isSearchShown,
          onSearchToggle: isShown => setIsSearchShown(isShown),
        },
        card: <MarketsStats />,
      }}
      contentStyle={{paddingBottom: 4}}>
      {!isSearchShown && (
        <View style={styles.filters}>
          <View style={styles.filter}>
            <Button
              accent="black"
              size="small"
              shadowStyle={styles.filterShadowStyle}>
              All
            </Button>
          </View>
          <View style={styles.filter}>
            <Button
              size="small"
              icon={StarSvg}
              shadowStyle={styles.filterShadowStyle}
            />
          </View>
          <View style={styles.filter}>
            <Button size="small" shadowStyle={styles.filterShadowStyle}>
              Layer 1
            </Button>
          </View>
          <View style={styles.filter}>
            <Button size="small" shadowStyle={styles.filterShadowStyle}>
              DeFi
            </Button>
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
    </Layout>
  );
};

const styles = StyleSheet.create({
  filters: {
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  filter: {
    marginRight: 12,
  },
  filterShadowStyle: {
    shadowColor: colors.neutral500,
    shadowOffset: {width: 2, height: 4},
    shadowRadius: 8,
    shadowOpacity: 0.06,
  },
});

export default MarketsScreen;
