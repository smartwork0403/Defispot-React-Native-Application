import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import axios from 'axios';

import Layout from '../components/Layout';
import AssetsList from '../components/AssetsList';
import MarketsStats from '../components/MarketsStats';
import Button from '../components/Button';
import SortBy from '../components/SortBy';
import Card from '../components/Card';
import CustomText from '../components/CustomText';

import type {Asset} from '../components/AssetsList';

import {colors} from '../styles';

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

const ASSETS_STATE = {
  loading: 'loading',
  success: 'success',
  error: 'error',
};

const Markets: React.FC = () => {
  const [sortBy, setSortBy] = useState('volume');
  const [isSearchShown, setIsSearchShown] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const [assetsState, setAssetsState] = useState(ASSETS_STATE.loading);
  const [assetsListData, setAssetsListData] = useState<Asset[]>([]);
  const [showingAssetsList, setShowingAssetsList] = useState<Asset[]>([]);

  // const pools = useAppSelector(selectAvailablePoolsMarketCap);

  // useEffect(() => {
  //   console.log(pools);
  //   console.log(REACT_APP_MIDGARD_TESTNET_URL);
  // }, [pools]);

  const handleSearch = inputValue => {
    if (inputValue.length > 0) {
      const filteredData = assetsListData.filter(asset =>
        asset.name.toLowerCase().includes(inputValue.toLowerCase()),
      );
      setShowingAssetsList(filteredData);
    } else {
      setShowingAssetsList(assetsListData);
    }
  };

  useEffect(() => {
    if (assetsListData.length === 0) {
      getData();
    }
  }, [assetsListData]);

  const getData = async () => {
    try {
      const dataSet1 = await axios.get(
        'https://fi40rvt5l0.execute-api.us-east-1.amazonaws.com/test/api/v2/assets/info',
      );
      const dataSet2 = await axios.get(
        'https://api.rango.exchange/meta?apiKey=57e66bdb-07ae-4956-a117-7570276a02d6',
      );

      const assetsImageMap = new Map();
      dataSet2.data.tokens.forEach(token => {
        assetsImageMap.set(token.symbol, token.image);
      });

      console.log('dataSet1', dataSet1);

      const data: Asset[] = [];

      dataSet1.data.forEach(asset => {
        data.push({
          cmcId: asset.cmcId,
          name: asset.asset_full_name,
          symbol: asset.symbol,
          chain: asset.chain,
          chainSymbol: asset.chain_full_name,
          address: asset.token_address,
          image: assetsImageMap.get(asset.symbol),
          marketCap: asset.market_cap,
          percentChange24: asset.percent_change_24h,
          price: asset.price,
          volume24: asset.volume_24h,
        });
      });

      console.log('data', data);

      setAssetsListData(data);
      setShowingAssetsList(data);
      setAssetsState(ASSETS_STATE.success);
    } catch (e) {
      console.log('Error while fetching data in markets page', e);
      setAssetsState(ASSETS_STATE.error);
    }
  };

  const getAssetsList = () => {
    if (assetsState === ASSETS_STATE.success) {
      if (assetsListData.length === 0) {
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
              setShowingAssetsList(assetsListData);
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

      {assetsState === ASSETS_STATE.loading ? (
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
