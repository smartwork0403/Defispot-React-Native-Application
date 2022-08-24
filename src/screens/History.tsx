import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {colors, globalStyles} from '../styles';

import CustomText from '../components/CustomText';
import Layout from '../components/Layout';
import TextField from '../components/TextField';
import Button from '../components/Button';
import CollapsibleArrow from '../components/CollapsibleArrow';
import NoWalletConnected from '../components/NoWalletConnected';
import TransactionDetails from '../components/TransactionDetailsModal';
import Card from '../components/Card';
import SortBy from '../components/SortBy';

import MagnifySvg from '../assets/icons/magnify.svg';
import DownloadSvg from '../assets/icons/download.svg';
import ArrowUpRightSvg from '../assets/icons/arrow-up-right.svg';
import SwapSvg from '../assets/icons/swap.svg';

import BTCLogoSvg from '../assets/crypto-logos/btc.svg';
import ETHLogoSvg from '../assets/crypto-logos/eth.svg';
import AVAXLogoSvg from '../assets/crypto-logos/avax.svg';
import ChartSvg from '../assets/icons/chart.svg';
import ArrowUpSvg from '../assets/icons/arrow-up.svg';
import ArrowDownSvg from '../assets/icons/arrow-down.svg';
import CursorTextSvg from '../assets/icons/cursor-text.svg';
import DollarCircleSvg from '../assets/icons/dollar-circle.svg';

const HistoryItem: React.FC<{
  type: 'sent' | 'exchange';
  time: string;
}> = ({type, time}) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  return (
    <>
      <Card
        style={historyItemStyle.historyItem}
        onPress={() => setIsDetailsModalOpen(true)}>
        <View style={historyItemStyle.iconContainer}>
          <View style={historyItemStyle.iconType}>
            {type === 'sent' ? (
              <ArrowUpRightSvg
                width={14}
                height={14}
                color={colors.neutral300}
              />
            ) : type === 'exchange' ? (
              <SwapSvg width={20} height={20} color={colors.neutral300} />
            ) : null}
          </View>

          <View style={historyItemStyle.iconCoinContainer}>
            <BTCLogoSvg style={{height: 18, width: 18, borderRadius: 18 / 2}} />
          </View>
        </View>

        <View style={historyItemStyle.infoContainer}>
          <CustomText weight="medium">
            {type === 'sent' ? 'Sent' : 'Exchange'}
          </CustomText>
          <CustomText style={historyItemStyle.infoTime}>{time}</CustomText>
        </View>

        <CollapsibleArrow startArrowAngel="right" finishArrowAngel="right" />
      </Card>

      <TransactionDetails
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </>
  );
};

const historyItemStyle = StyleSheet.create({
  historyItem: {
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 12,
    flexShrink: 0,
  },
  iconType: {
    borderColor: colors.neutral200,
    borderWidth: 1,
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCoinContainer: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
    backgroundColor: colors.neutral0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -4,
    bottom: -4,
  },
  infoContainer: {
    marginRight: 'auto',
  },
  infoTime: {
    color: colors.neutral400,
  },
});

const filters = [
  {
    label: 'All',
    name: 'all',
    icon: null,
  },
  {
    label: 'Ethereum',
    name: 'ethereum',
    icon: BTCLogoSvg,
  },
  {
    label: 'Bitcoin',
    name: 'bitcoin',
    icon: ETHLogoSvg,
  },
  {
    label: 'Avalanche',
    name: 'avalanche',
    icon: AVAXLogoSvg,
  },
];

type HistoryLists = {
  time: string;
  items: {type: 'sent' | 'exchange'; time: string}[];
}[];

let historyLists: HistoryLists = [
  {
    time: 'July 14, 2022',
    items: [
      {
        type: 'sent',
        time: '8:33 AM',
      },
    ],
  },
  {
    time: 'July 12, 2022',
    items: [
      {
        type: 'sent',
        time: '8:33 AM',
      },
      {
        type: 'exchange',
        time: '8:33 AM',
      },
    ],
  },
  {
    time: 'July 11, 2022',
    items: [
      {
        type: 'sent',
        time: '8:33 AM',
      },
      {
        type: 'sent',
        time: '8:33 AM',
      },
    ],
  },
];

// historyLists = [];

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

const History: React.FC = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(filters[0].name);
  const [sortBy, setSortBy] = useState('volume');

  const shouldFiltersBeShown = () => {
    if (historyLists.length === 0) {
      return true;
    }

    return !isSearchFocused;
  };

  return (
    <Layout
      stickyHeader
      footer={
        <>
          {historyLists.length !== 0 && (
            <View style={styles.stickyActionContainer}>
              <Button
                outlined
                accent="white"
                prependIcon={{icon: DownloadSvg}}
                style={globalStyles.wrapper}>
                Download CSV
              </Button>
            </View>
          )}
        </>
      }
      contentStyle={{padding: 0}}
      header={{
        minimal: {
          title: 'History',
          back: true,
        },
      }}>
      <View
        style={[globalStyles.wrapper, styles.container, {paddingBottom: 0}]}>
        <TextField
          placeholder="Filter by protocol, token, event, etc..."
          prependIcon={{icon: MagnifySvg}}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          noOutline
          shadow
        />
      </View>

      {shouldFiltersBeShown() && (
        <ScrollView
          style={styles.filters}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {filters.map((filter, i) => {
            if (i !== 1) {
              return (
                <Button
                  key={filter.label}
                  onPress={() => setSelectedFilter(filter.name)}
                  outlined={filter.name === selectedFilter}
                  accent="white"
                  size="small"
                  style={{
                    marginTop: 16,
                    marginBottom: 16,
                    paddingLeft: filter.icon ? 6 : 12,
                    marginRight: filters.length === i + 1 ? 16 : 12,
                    marginLeft: i === 0 ? 16 : 0,
                  }}
                  prependIcon={{
                    icon: filter.icon ?? null,
                    width: 20,
                    height: 20,
                  }}
                  shadow>
                  {filter.label}
                </Button>
              );
            } else {
              return (
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
                  size="small"
                  accent="white"
                  shadow
                  style={{
                    marginTop: 16,
                    marginBottom: 16,
                    marginRight: 12,
                  }}
                />
              );
            }
          })}
        </ScrollView>
      )}

      <View
        style={{
          ...styles.container,
          ...globalStyles.wrapper,
          paddingTop: shouldFiltersBeShown() ? 0 : 16,
          paddingBottom: 0,
        }}>
        {historyLists.length !== 0 ? (
          historyLists.map(list => (
            <View style={styles.list} key={list.time}>
              <CustomText weight="medium" style={styles.listTitle}>
                {list.time}
              </CustomText>
              {list.items.map(item => (
                <HistoryItem
                  type={item.type}
                  time={item.time}
                  key={item.time}
                />
              ))}
            </View>
          ))
        ) : (
          <NoWalletConnected />
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  filters: {
    flexDirection: 'row',
  },
  stickyActionContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 16,
    paddingLeft: 16,
    backgroundColor: colors.neutral0,
  },
  list: {
    marginBottom: 8,
  },
  listTitle: {
    marginBottom: 8,
    color: colors.neutral400,
    fontSize: 12,
    lineHeight: 16,
  },
});

export default History;
