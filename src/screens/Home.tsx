import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Table, TableWrapper, Cell} from 'react-native-table-component';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {cloneDeep} from 'lodash';

import {colors, globalStyles} from '../styles';
import {ASSETS_STATE} from '../hooks/useAssets';
import {useApp} from '../redux/app/hooks';
import {formatFloat} from '../helpers/NumberUtil';

import type {HomeStackParamList} from '../components/Navigation';
import Layout from '../components/Layout';
import CustomText from '../components/CustomText';
import Asset from '../components/Asset';
import AssetsList, {Asset as AssetType} from '../components/AssetsList';
import Card from '../components/Card';

import BellUnreadSvg from '../assets/icons/bell-unread.svg';
import AnnouncementSVG from '../assets/icons/announcement.svg';
import UnorderedListSVG from '../assets/icons/unordered-list.svg';
import ArrowUpSVG from '../assets/icons/arrow-up.svg';
import ArrowDownSVG from '../assets/icons/arrow-down.svg';
import SwapSVG from '../assets/icons/swap.svg';
import AlignArrowUpSVG from '../assets/icons/align-arrow-up.svg';
import AlignArrowDownSVG from '../assets/icons/align-arrow-down.svg';
import ArrowDownRightSVG from '../assets/icons/arrow-down-right.svg';

const carouselItems = [require('../assets/images/banner.png')];

const switchItems = [
  {
    label: 'Hot',
    name: 'hot',
  },
  {
    label: 'Gainers',
    name: 'gainers',
  },
  {
    label: 'Losers',
    name: 'losers',
  },
  {
    label: '24h Vol',
    name: '24h-vol',
  },
];

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Home: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const windowWidth = Dimensions.get('window').width;

  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [currentSwitch, setCurrentSwitch] = useState(switchItems[0].name);

  const [isSearchShown, setIsSearchShown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stakingHeaderItems, setStakingHeaderItems] = useState([
    {
      symbol: 'RUNE',
      percentChange24h: 0,
      price: 0,
    },
    {
      symbol: 'BTC',
      percentChange24h: 0,
      price: 0,
    },
    {
      symbol: 'ETH',
      percentChange24h: 0,
      price: 0,
    },
  ]);

  const [searchInputValue, setSearchInputValue] = useState('');
  const [showingAssetsList, setShowingAssetsList] = useState<AssetType[]>([]);
  const [homeAssetsList, setHomeAssetsList] = useState<AssetType[]>([]);

  const {assetsList} = useApp();

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    wait(2000).then(() => setIsRefreshing(false));
  }, []);

  const navigationItems = [
    {
      name: 'swap',
      icon: SwapSVG,
      onPress: () => navigation.navigate('Trade', {screen: 'Swap'}),
    },
    {
      name: 'ascending',
      icon: AlignArrowUpSVG,
      onPress: () => navigation.navigate('Trade', {screen: 'Withdraw'}),
    },
    {
      name: 'descending',
      icon: AlignArrowDownSVG,
      onPress: () => navigation.navigate('Trade', {screen: 'Deposit'}),
    },
    {
      name: 'down',
      icon: ArrowDownRightSVG,
      onPress: () => navigation.navigate('Trade', {screen: 'Deposit'}),
    },
  ];

  useEffect(() => {
    if (
      assetsList.state === ASSETS_STATE.success &&
      assetsList.data.length > 0
    ) {
      // find stacking header items
      const rune = assetsList.data.find(asset => asset.symbol === 'RUNE');
      const btc = assetsList.data.find(asset => asset.symbol === 'BTC');
      const eth = assetsList.data.find(asset => asset.symbol === 'ETH');

      if (rune && btc && eth) {
        setStakingHeaderItems([
          {
            symbol: 'RUNE',
            percentChange24h: rune.percentChange24h,
            price: rune.price,
          },
          {
            symbol: 'BTC',
            percentChange24h: btc.percentChange24h,
            price: btc.price,
          },
          {
            symbol: 'ETH',
            percentChange24h: eth.percentChange24h,
            price: eth.price,
          },
        ]);
      }
    }
  }, [assetsList, assetsList.state, assetsList.data]);

  useEffect(() => {
    if (
      assetsList.state === ASSETS_STATE.success &&
      assetsList.data.length > 0
    ) {
      const list = cloneDeep(assetsList.data).sort((a, b) => {
        if (currentSwitch === 'hot') {
          return a.marketCap - b.marketCap;
        }

        if (currentSwitch === 'gainers') {
          return b.percentChange24h - a.percentChange24h;
        }

        if (currentSwitch === 'losers') {
          return a.percentChange24h - b.percentChange24h;
        }

        if (currentSwitch === '24h-vol') {
          return a.volume24 - b.volume24;
        }

        return 0;
      });

      setHomeAssetsList(list.slice(0, 10));
    }
  }, [assetsList.data, assetsList.state, currentSwitch]);

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
      contentStyle={{padding: 0}}
      stickyHeader
      pulldownRefresh={{isRefreshing, onRefresh}}
      header={{
        searchable: {
          action: {
            icon: BellUnreadSvg,
            onActionPress: () => navigation.navigate('Notifications'),
          },
          inputPlaceholder: 'Search...',
          onSearchToggle: isShown => {
            setIsSearchShown(isShown);

            if (!isShown) {
              setShowingAssetsList(assetsList.data);
            } else {
              handleSearch(searchInputValue);
            }
          },
          isShown: isSearchShown,
          inputValue: searchInputValue,
          onInputChangeText: text => {
            setSearchInputValue(text);
            handleSearch(text);
          },
        },
        extended: true,
      }}>
      <View
        style={[
          styles.assetsContainer,
          {display: isSearchShown ? 'flex' : 'none'},
        ]}>
        {assetsList.state === ASSETS_STATE.loading ||
        assetsList.state === ASSETS_STATE.idle ? (
          <View style={styles.assetsLoadingContainer}>
            <ActivityIndicator size="large" color={colors.blue} />
          </View>
        ) : (
          getAssetsList()
        )}
      </View>

      <View style={{display: isSearchShown ? 'none' : 'flex'}}>
        <GestureHandlerRootView>
          <View style={styles.carouselContainer}>
            <Carousel
              width={windowWidth - 32}
              height={170}
              loop
              autoPlay
              autoPlayInterval={5000}
              data={carouselItems}
              renderItem={({item}) => (
                <Image
                  source={item}
                  style={{
                    backgroundColor: 'green',
                    flex: 1,
                    width: '100%',
                    height: '100%',
                  }}
                />
              )}
              panGestureHandlerProps={{
                activeOffsetX: [-10, 10],
              }}
              onScrollEnd={index => setCurrentCarouselIndex(index)}
            />

            {/* <View style={styles.carouselIndex}>
              <CustomText weight="medium" style={styles.carouselIndexText}>
                {currentCarouselIndex + 1}/{carouselItems.length}
              </CustomText>
            </View> */}
          </View>
        </GestureHandlerRootView>

        <View style={globalStyles.wrapper}>
          <View style={styles.stakingSpecial}>
            <AnnouncementSVG
              height={12}
              width={12}
              style={{marginRight: 8}}
              color={colors.neutral400}
            />
            <CustomText weight="medium" style={styles.stakingSpecialText}>
              #Defspot Staking Special
            </CustomText>
            <UnorderedListSVG
              height={11}
              width={11}
              color={colors.neutral400}
            />
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              {stakingHeaderItems.map(item => (
                <View style={styles.headerItem} key={item.symbol}>
                  <View style={styles.headerItemTop}>
                    <CustomText
                      weight="medium"
                      style={styles.headerItemTopName}>
                      {item.symbol}
                    </CustomText>
                    {item.percentChange24h.toString().includes('-') ? (
                      <ArrowDownSVG
                        height={10}
                        width={7}
                        style={{marginLeft: 9, marginRight: 9}}
                        color={colors.red}
                      />
                    ) : (
                      <ArrowUpSVG
                        height={10}
                        width={7}
                        style={{marginLeft: 9, marginRight: 9}}
                        color={colors.green}
                      />
                    )}

                    <CustomText
                      weight="medium"
                      style={{
                        ...styles.headerItemTopPercent,
                        color: item.percentChange24h.toString().includes('-')
                          ? colors.red
                          : colors.green,
                      }}>
                      {item.percentChange24h.toFixed(2)}%
                    </CustomText>
                  </View>
                  <CustomText
                    weight="medium"
                    style={styles.headerItemBottomValue}>
                    ${formatFloat(item.price, 2)}
                  </CustomText>
                </View>
              ))}
            </View>

            <View style={styles.navigationList}>
              {navigationItems.map((filter, i) => (
                <TouchableOpacity
                  style={[
                    styles.navigationBtn,
                    {marginRight: navigationItems.length !== i + 1 ? 12 : 0},
                  ]}
                  onPress={filter.onPress}
                  key={filter.name}>
                  <View style={styles.navigationIconContainer}>
                    <filter.icon
                      height={12}
                      width={12}
                      color={colors.neutral900}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.switchContainer}>
              {switchItems.map(item => (
                <Pressable
                  style={{
                    ...styles.switch,
                    backgroundColor:
                      currentSwitch === item.name
                        ? colors.neutral100
                        : 'transparent',
                  }}
                  onPress={() => setCurrentSwitch(item.name)}
                  key={item.name}>
                  <CustomText weight="medium" style={styles.switchText}>
                    {item.label}
                  </CustomText>
                </Pressable>
              ))}
            </View>
            <View style={styles.table}>
              <Table>
                {/* header */}
                <TableWrapper style={styles.tableHeader}>
                  <Cell
                    data={
                      <CustomText
                        weight="medium"
                        style={styles.tableHeaderText}>
                        Name
                      </CustomText>
                    }
                    style={{flex: 1.5}}
                  />
                  <Cell
                    data={
                      <CustomText
                        weight="medium"
                        style={styles.tableHeaderText}>
                        Last Price
                      </CustomText>
                    }
                  />
                  <Cell
                    data={
                      <CustomText
                        weight="medium"
                        style={{
                          ...styles.tableHeaderText,
                          textAlign: 'right',
                        }}>
                        24h chg%
                      </CustomText>
                    }
                  />
                </TableWrapper>

                {assetsList.state === ASSETS_STATE.loading ||
                assetsList.state === ASSETS_STATE.idle ? (
                  <View style={styles.tableLoadingContainer}>
                    <ActivityIndicator size="large" color={colors.blue} />
                  </View>
                ) : assetsList.state === ASSETS_STATE.error ? (
                  <Card>
                    <CustomText style={{color: colors.red}}>
                      Error while fetching data!
                    </CustomText>
                  </Card>
                ) : (
                  homeAssetsList.map(asset => (
                    <TableWrapper
                      style={{
                        ...styles.tableRow,
                        marginBottom: 24,
                      }}
                      key={asset.cmcId}>
                      <Cell
                        data={
                          <Asset
                            name={asset.name}
                            image={asset.image}
                            size="small"
                          />
                        }
                        style={{flex: 1.5}}
                      />
                      <Cell
                        data={
                          <CustomText weight="medium">
                            ${formatFloat(asset.price, 2)}
                          </CustomText>
                        }
                      />
                      <Cell
                        data={
                          <View style={styles.tableItemChangeContainer}>
                            <CustomText
                              weight="medium"
                              style={[
                                styles.tableItemChange,
                                {
                                  color: asset.percentChange24h
                                    .toString()
                                    .includes('-')
                                    ? colors.redDark
                                    : colors.greenDark,
                                  backgroundColor: asset.percentChange24h
                                    .toString()
                                    .includes('-')
                                    ? colors.redLight
                                    : colors.greenLight,
                                },
                              ]}>
                              {asset.percentChange24h.toString().includes('-')
                                ? ''
                                : '+'}
                              {asset.percentChange24h.toFixed(2)}%
                            </CustomText>
                          </View>
                        }
                      />
                    </TableWrapper>
                  ))
                )}
              </Table>
            </View>
          </View>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  assetsContainer: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 16,
    paddingRight: 16,
  },
  assetsLoadingContainer: {
    marginTop: 70,
  },
  noResult: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  carouselContainer: {
    position: 'relative',
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  carouselIndex: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    zIndex: 10,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 8,
    paddingLeft: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(18, 19, 21, 0.64)',
  },
  carouselIndexText: {
    color: colors.neutral0,
    fontSize: 12,
    lineHeight: 16,
  },
  stakingSpecial: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 21,
    paddingRight: 21,
    paddingTop: 12,
    paddingBottom: 12,
  },
  stakingSpecialText: {
    marginRight: 'auto',
    fontSize: 12,
    lineHeight: 16,
    paddingRight: 16,
    color: colors.neutral400,
  },
  content: {
    backgroundColor: colors.neutral0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerItem: {
    padding: 20,
  },
  headerItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerItemTopName: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.neutral400,
  },
  headerItemTopPercent: {
    fontSize: 12,
    lineHeight: 16,
  },
  headerItemBottomValue: {
    fontSize: 18,
  },
  navigationList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
  },
  navigationBtn: {
    paddingBottom: 12,
    paddingTop: 12,
    paddingLeft: 28,
    paddingRight: 28,
    backgroundColor: colors.neutral0,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationIconContainer: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  switch: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 4,
  },
  switchText: {
    fontSize: 12,
    lineHeight: 16,
  },
  table: {
    paddingRight: 16,
    paddingLeft: 16,
  },
  tableHeader: {
    marginBottom: 24,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableHeaderText: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.neutral400,
  },
  tableLoadingContainer: {
    marginTop: 30,
    marginBottom: 200,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableItemChangeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tableItemChange: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 8,
    paddingLeft: 8,
    borderRadius: 100,
    fontSize: 12,
    lineHeight: 16,
    backgroundColor: 'red',
  },
});

export default Home;
