import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {globalStyles} from '../styles';

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
// import Header from '../components/Header';
import {useAppSelector} from '../redux/hooks';
import {selectAvailablePoolsMarketCap} from '../redux/midgard/slice';
import {useEffect} from 'react';
import {REACT_APP_MIDGARD_TESTNET_URL} from '@env';
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
  const pools = useAppSelector(selectAvailablePoolsMarketCap);

  useEffect(() => {
    console.log(pools);
    console.log(REACT_APP_MIDGARD_TESTNET_URL);
  }, [pools]);

  return (
    <Layout
      header={{
        title: 'Markets',
        searchable: {
          isShown: isSearchShown,
          onSearchToggle: isShown => setIsSearchShown(isShown),
        },
        card: !isSearchShown ? <MarketsStats /> : null,
      }}
      contentStyle={{paddingBottom: 4}}>
      {!isSearchShown && (
        <View style={styles.filters}>
          <View style={styles.filter}>
            <Button
              accent="black"
              size="small"
              shadowStyle={globalStyles.shadow}>
              All
            </Button>
          </View>
          <View style={styles.filter}>
            <Button
              size="small"
              icon={StarSvg}
              shadowStyle={globalStyles.shadow}
            />
          </View>
          <View style={styles.filter}>
            <Button size="small" shadowStyle={globalStyles.shadow}>
              Layer 1
            </Button>
          </View>
          <View style={styles.filter}>
            <Button size="small" shadowStyle={globalStyles.shadow}>
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
            shadowStyle={globalStyles.shadow}
          />
        </View>
      )}

      <AssetsList style={{marginTop: isSearchShown ? -46 : 0}} />
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
});

export default MarketsScreen;
