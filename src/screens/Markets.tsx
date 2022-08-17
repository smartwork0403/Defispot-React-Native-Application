import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {colors} from '../styles';

import Layout from '../components/Layout';
import AssetsList from '../components/AssetsList';
import MarketsStats from '../components/MarketsStats';
import Button from '../components/Button';
import Select from '../components/Select';
import IconButton from '../components/IconButton';

import StarSvg from '../assets/icons/star-outlined-thick.svg';
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

          <IconButton
            icon={StarSvg}
            iconSize={{width: 12, height: 12}}
            color={colors.neutral900}
            size="small"
            style={styles.filter}
            accent="white"
            shadow
          />
          <Button size="small" shadow accent="white" style={styles.filter}>
            Layer 1
          </Button>
          <Button size="small" shadow accent="white" style={styles.filter}>
            DeFi
          </Button>

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
            accent="white"
            shadow
          />
        </View>
      )}

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
});

export default Markets;
