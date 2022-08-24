import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import Layout from '../components/Layout';
import AssetsList from '../components/AssetsList';
import MarketsStats from '../components/MarketsStats';
import Button from '../components/Button';
import SortBy from '../components/SortBy';
import Card from '../components/Card';
import CustomText from '../components/CustomText';

import ChartSvg from '../assets/icons/chart.svg';
import ArrowUpSvg from '../assets/icons/arrow-up.svg';
import ArrowDownSvg from '../assets/icons/arrow-down.svg';
import CursorTextSvg from '../assets/icons/cursor-text.svg';
import DollarCircleSvg from '../assets/icons/dollar-circle.svg';
// import Header from '../components/Header';
// import {useAppSelector} from '../redux/hooks';
// import {selectAvailablePoolsMarketCap} from '../redux/midgard/slice';
// import {useEffect} from 'react';
// import {REACT_APP_MIDGARD_TESTNET_URL} from '@env';
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

const Markets: React.FC = () => {
  const [sortBy, setSortBy] = useState('volume');
  const [isSearchShown, setIsSearchShown] = useState(false);
  // const pools = useAppSelector(selectAvailablePoolsMarketCap);

  // useEffect(() => {
  //   console.log(pools);
  //   console.log(REACT_APP_MIDGARD_TESTNET_URL);
  // }, [pools]);

  return (
    <Layout
      stickyHeader
      header={{
        title: 'Markets',
        searchable: {
          isShown: isSearchShown,
          onSearchToggle: isShown => setIsSearchShown(isShown),
        },
        extended: true,
      }}
      contentStyle={{paddingBottom: 8, paddingTop: 0}}>
      {!isSearchShown && <MarketsStats />}

      {!isSearchShown && (
        <View style={styles.filters}>
          <Button accent="black" size="small" shadow style={styles.filter}>
            All
          </Button>

          <Button size="small" shadow accent="white" style={styles.filter}>
            Layer 1
          </Button>
          <Button size="small" shadow accent="white" style={styles.filter}>
            DeFi
          </Button>

          <SortBy
            header={{
              title: 'Sort by',
              actionLabel: 'Reset',
              onHeaderActionPress: () => setSortBy('volume'),
            }}
            items={sortByItems}
            selected={sortBy}
            onSelect={name => setSortBy(name)}
            label="Sort by"
            style={styles.sortBy}
            shadow
          />
        </View>
      )}

      {/* <Card style={styles.noResult}>
        <CustomText weight="medium">No results for “Kevin”</CustomText>
      </Card> */}

      <AssetsList style={{marginTop: isSearchShown ? 4 : 0}} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  filters: {
    paddingBottom: 16,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  filter: {
    marginRight: 12,
  },
  sortBy: {
    flexGrow: 1,
  },
  noResult: {
    paddingTop: 12,
    paddingBottom: 12,
  },
});

export default Markets;
