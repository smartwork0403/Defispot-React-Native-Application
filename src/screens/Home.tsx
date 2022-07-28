import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Dimensions, Image, Pressable, StyleSheet, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Table, TableWrapper, Cell} from 'react-native-table-component';

import Layout from '../components/Layout';
import CustomText from '../components/CustomText';

import BellUnreadSvg from '../assets/icons/bell-unread.svg';
import AnnouncementSVG from '../assets/icons/announcement.svg';
import UnorderedListSVG from '../assets/icons/unordered-list.svg';
import ArrowUpSVG from '../assets/icons/arrow-up.svg';
import ArrowDownSVG from '../assets/icons/arrow-down.svg';
import Asset from '../components/Asset';

const carouselItems = [
  require('../assets/images/banner.png'),
  require('../assets/images/banner.png'),
  require('../assets/images/banner.png'),
];

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

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const windowWidth = Dimensions.get('window').width;

  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [currentSwitch, setCurrentSwitch] = useState(switchItems[0].name);

  const stakingHeaderItems = [
    {
      name: 'ETH',
      percent: 1.2,
      upward: false,
      value: '235,6',
    },
    {
      name: 'BTC',
      percent: 6.8,
      upward: true,
      value: '20.187,57',
    },
    {
      name: 'LINK',
      percent: 3.4,
      upward: true,
      value: '1232,2',
    },
  ];

  const tableRows = [
    {
      asset: {name: 'LINK'},
      lastPrice: '235,0',
      change: '1,90',
      upward: true,
    },
    {
      asset: {name: 'BTC'},
      lastPrice: '20.206,57',
      change: '4,90',
      upward: true,
    },
    {
      asset: {name: 'ETH'},
      lastPrice: '36,27',
      change: '0,20',
      upward: false,
    },
    {
      asset: {name: 'AVAX'},
      lastPrice: '235,0',
      change: '2,90',
      upward: true,
    },
  ];

  return (
    <Layout
      header={{
        searchable: {
          persistence: {
            actionIcon: BellUnreadSvg,
            onActionIconClick: () => navigation.navigate('Notifications'),
          },
          inputPlaceholder: 'Search market...',
        },
        card: (
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

              <View style={styles.carouselIndex}>
                <CustomText style={styles.carouselIndexText}>
                  {currentCarouselIndex + 1}/{carouselItems.length}
                </CustomText>
              </View>
            </View>
          </GestureHandlerRootView>
        ),
        cardStyle: {
          paddingLeft: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingTop: 0,
          overflow: 'hidden',
        },
      }}
      customContent={
        <>
          <View style={styles.stakingSpecial}>
            <AnnouncementSVG
              height={12}
              width={12}
              style={{marginRight: 8}}
              color="#A1A1A8"
            />
            <CustomText style={styles.stakingSpecialText}>
              #Defspot Staking Special
            </CustomText>
            <UnorderedListSVG height={11} width={11} color="#A1A1A8" />
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              {stakingHeaderItems.map(item => (
                <View style={styles.headerItem} key={item.name}>
                  <View style={styles.headerItemTop}>
                    <CustomText style={styles.headerItemTopName}>
                      {item.name}
                    </CustomText>
                    {item.upward ? (
                      <ArrowUpSVG
                        height={10}
                        width={7}
                        style={{marginLeft: 9, marginRight: 9}}
                        color="#00B674"
                      />
                    ) : (
                      <ArrowDownSVG
                        height={10}
                        width={7}
                        style={{marginLeft: 9, marginRight: 9}}
                        color="#EF4444"
                      />
                    )}

                    <CustomText
                      style={{
                        ...styles.headerItemTopPercent,
                        color: item.upward ? '#00B674' : '#EF4444',
                      }}>
                      {item.percent}%
                    </CustomText>
                  </View>
                  <CustomText style={styles.headerItemBottomValue}>
                    {item.value}
                  </CustomText>
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.switchContainer}>
              {switchItems.map(item => (
                <Pressable
                  style={{
                    ...styles.switch,
                    backgroundColor:
                      currentSwitch === item.name ? '#EFF0F3' : 'transparent',
                  }}
                  onPress={() => setCurrentSwitch(item.name)}
                  key={item.name}>
                  <CustomText style={styles.switchText}>
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
                      <CustomText style={styles.tableHeaderText}>
                        Name
                      </CustomText>
                    }
                    style={{flex: 1.5}}
                  />
                  <Cell
                    data={
                      <CustomText style={styles.tableHeaderText}>
                        Last Price
                      </CustomText>
                    }
                  />
                  <Cell
                    data={
                      <CustomText
                        style={{
                          ...styles.tableHeaderText,
                          textAlign: 'right',
                        }}>
                        24h chg%
                      </CustomText>
                    }
                  />
                </TableWrapper>

                {/* rows */}
                {tableRows.map(row => (
                  <TableWrapper
                    style={{
                      ...styles.tableRow,
                      marginBottom: 24,
                    }}
                    key={row.asset.name}>
                    <Cell
                      data={<Asset name={row.asset.name} size="small" />}
                      style={{flex: 1.5}}
                    />
                    <Cell
                      data={
                        <CustomText style={styles.tableItemPrice}>
                          {row.lastPrice}
                        </CustomText>
                      }
                    />
                    <Cell
                      data={
                        <View style={styles.tableItemChangeContainer}>
                          <CustomText
                            style={{
                              ...styles.tableItemChange,
                              color: row.upward ? '#007A4E' : '#BC1010',
                              backgroundColor: row.upward
                                ? '#EBFFF8'
                                : '#FDECEC',
                            }}>
                            {row.upward ? '+' : '-'}
                            {row.change}%
                          </CustomText>
                        </View>
                      }
                    />
                  </TableWrapper>
                ))}
              </Table>
            </View>
          </View>
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    position: 'relative',
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
    color: '#fff',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter-Medium',
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
    fontFamily: 'Inter-Medium',
    paddingRight: 16,
    color: '#A1A1A8',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 8,
    flex: 1,
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
    fontFamily: 'Inter-Medium',
    color: '#A1A1A8',
  },
  headerItemTopPercent: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter-Medium',
  },
  headerItemBottomValue: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  divider: {
    height: 1,
    backgroundColor: '#EFF0F3',
    marginBottom: 20,
    marginLeft: 16,
    marginRight: 16,
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
    fontFamily: 'Inter-Medium',
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
    fontFamily: 'Inter-Medium',
    color: '#A1A1A8',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableItemPrice: {
    fontFamily: 'Inter-Medium',
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
    borderRadius: 24,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter-Medium',
    backgroundColor: 'red',
  },
});

export default HomeScreen;
