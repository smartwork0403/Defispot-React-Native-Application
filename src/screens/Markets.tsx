import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useApp} from '../redux/app/hooks';

import Layout from '../components/Layout';
import AssetsList from '../components/AssetsList';
import MarketsStats from '../components/MarketsStats';
import Button from '../components/Button';
import SortBy from '../components/SortBy';
import Card from '../components/Card';
import CustomText from '../components/CustomText';

import type {Asset} from '../components/AssetsList';
import {ASSETS_STATE} from '../hooks/useAssets';

import {colors} from '../styles';

import ChartSvg from '../assets/icons/chart.svg';
import ArrowUpSvg from '../assets/icons/arrow-up.svg';
import ArrowDownSvg from '../assets/icons/arrow-down.svg';
import CursorTextSvg from '../assets/icons/cursor-text.svg';
import DollarCircleSvg from '../assets/icons/dollar-circle.svg';

// import {useAppSelector} from '../redux/hooks';
// import {selectAvailablePoolsMarketCap} from '../redux/midgard/slice';
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
  const [searchInputValue, setSearchInputValue] = useState('');

  const [showingAssetsList, setShowingAssetsList] = useState<Asset[]>([]);

  const {assetsList} = useApp();

  /*  const pools = useAppSelector(selectAvailablePoolsMarketCap);

  useEffect(() => {
    console.log('pools', pools);
    console.log(REACT_APP_MIDGARD_TESTNET_URL);
  }, [pools]); */

  useEffect(() => {
    setShowingAssetsList(assetsList.data);
  }, [assetsList.data]);

  const handleSearch = inputValue => {
    if (inputValue.length > 0) {
      const filteredData = assetsList.data.filter(asset =>
        asset.name.toLowerCase().includes(inputValue.toLowerCase()),
      );
      setShowingAssetsList(filteredData);
    } else {
      setShowingAssetsList(assetsList.data);
    }
  };

  const getAssetsList = () => {
    if (assetsList.state === ASSETS_STATE.success) {
      if (assetsList.data.length === 0) {
        return (
          <Card>
            <CustomText>No asset found!</CustomText>
          </Card>
        );
      }

      if (showingAssetsList.length === 0) {
        return (
          <Card style={styles.noResult}>
            <CustomText weight="medium">
              No results for “{searchInputValue}”
            </CustomText>
          </Card>
        );
      }

      return (
        <AssetsList
          assets={showingAssetsList}
          style={{marginTop: isSearchShown ? 4 : 0}}
        />
      );
    }

    return (
      <Card>
        <CustomText style={{color: colors.red}}>
          Error while fetching data!
        </CustomText>
      </Card>
    );
  };

  return (
    <Layout
      stickyHeader
      header={{
        title: 'Markets',
        searchable: {
          isShown: isSearchShown,
          onSearchToggle: isShown => {
            setIsSearchShown(isShown);

            if (!isShown) {
              setShowingAssetsList(assetsList.data);
            } else {
              handleSearch(searchInputValue);
            }
          },
          inputValue: searchInputValue,
          onInputChangeText: text => {
            setSearchInputValue(text);
            handleSearch(text);
          },
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

      {assetsList.state === ASSETS_STATE.loading ||
      assetsList.state === ASSETS_STATE.idle ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : (
        getAssetsList()
      )}
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
  loadingContainer: {
    marginTop: 70,
  },
});

export default Markets;
