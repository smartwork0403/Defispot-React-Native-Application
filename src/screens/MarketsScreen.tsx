import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

import BellUnreadSvg from '../assets/icons/bell-unread.svg';
import StarSvg from '../assets/icons/star-filled.svg';

import AssetsList from '../components/AssetsList';
import CustomText from '../components/CustomText';
import IconButton from '../components/IconButton';
import MarketsStats from '../components/MarketsStats';
import Button from '../components/Button';
import Select from '../components/Select';

import HomeSvg from '../assets/icons/home.svg';

const sortByItems = [
  {
    name: 'volume',
    label: 'volume',
    icon: HomeSvg,
  },
  {
    name: 'gainers',
    label: 'Gainers',
    icon: HomeSvg,
  },
  {
    name: 'losers',
    label: 'Losers',
    icon: HomeSvg,
  },
  {
    name: 'funding',
    label: 'Funding',
    icon: HomeSvg,
  },
  {
    name: 'name',
    label: 'Name',
    icon: HomeSvg,
  },
  {
    name: 'price',
    label: 'Price',
    icon: HomeSvg,
  },
];

const MarketsScreen: React.FC = () => {
  const [sortBy, setSortBy] = useState('funding');

  return (
    <ScrollView>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <CustomText style={styles.headerTitle}>Markets</CustomText>
          <IconButton icon={BellUnreadSvg} />
        </View>

        <View style={styles.headerBottom}>
          <MarketsStats />
        </View>
      </View>

      <View style={styles.filters}>
        <View style={styles.filter}>
          <Button accent="blue" size="small">
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
            onHeaderActionPress: () => setSortBy('funding'),
          }}
          items={sortByItems}
          selected={sortBy}
          onSelect={name => setSortBy(name)}
          label="Sort by"
          size="small"
        />
      </View>

      <AssetsList />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    // backgroundColor: 'red',
    marginBottom: 8,
  },
  headerTop: {
    backgroundColor: '#0077FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 45,
    paddingRight: 24,
    paddingLeft: 24,
  },
  headerBottom: {
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: -32,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 32,
    color: '#FFFFFF',
  },
  filters: {
    paddingTop: 16,
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
