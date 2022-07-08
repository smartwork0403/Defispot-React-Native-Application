import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

import MagnifySvg from '../assets/icons/magnify.svg';
import StarSvg from '../assets/icons/star-outlined.svg';

import AssetsList from '../components/AssetsList';
import CustomText from '../components/CustomText';
import IconButton from '../components/IconButton';
import MarketsStats from '../components/MarketsStats';
import Button from '../components/Button';
import Select from '../components/Select';

import ChartSvg from '../assets/icons/chart.svg';
import ArrowUpSvg from '../assets/icons/arrow-up.svg';
import ArrowDownSvg from '../assets/icons/arrow-down.svg';
import CursorTextSvg from '../assets/icons/cursor-text.svg';
import DollarCircleSvg from '../assets/icons/dollar-circle.svg';
import TextField from '../components/TextField';

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
    <ScrollView>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {isSearchShown ? (
            <>
              <TextField placeholder="Search..." icon={MagnifySvg} autoFocus />
              <Button
                style={styles.searchCancel}
                onPress={() => setIsSearchShown(false)}
                noPadding
                text
                textAccent="white">
                Cancel
              </Button>
            </>
          ) : (
            <>
              <CustomText style={styles.headerTitle}>Markets</CustomText>
              <IconButton
                icon={MagnifySvg}
                color="#fff"
                onPress={() => setIsSearchShown(true)}
              />
            </>
          )}
        </View>

        <View style={styles.headerBottom}>
          <MarketsStats />
        </View>
      </View>

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
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
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
  searchCancel: {
    marginLeft: 16,
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
