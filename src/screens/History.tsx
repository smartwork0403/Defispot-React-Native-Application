import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {colors, globalStyles} from '../styles';

import CustomText from '../components/CustomText';
import Layout from '../components/Layout';
import TextField from '../components/TextField';
import Button from '../components/Button';
import CollapsibleArrow from '../components/CollapsibleArrow';
import NoWalletConnected from '../components/NoWalletConnected';
import TransactionDetails from '../components/TransactionDetailsModal';
import Header from '../components/Header';

import MagnifySvg from '../assets/icons/magnify.svg';
import DownloadSvg from '../assets/icons/download.svg';
import ArrowUpRightSvg from '../assets/icons/arrow-up-right.svg';
import SwapSvg from '../assets/icons/swap.svg';

import BTCLogoSvg from '../assets/crypto-logos/btc.svg';
import ETHLogoSvg from '../assets/crypto-logos/eth.svg';
import AVAXLogoSvg from '../assets/crypto-logos/avax.svg';

const HistoryItem: React.FC<{
  type: 'sent' | 'exchange';
  time: string;
}> = ({type, time}) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  return (
    <>
      <Pressable
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
      </Pressable>

      <TransactionDetails
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </>
  );
};

const historyItemStyle = StyleSheet.create({
  historyItem: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    borderRadius: 8,
    borderColor: colors.neutral100,
    borderWidth: 1,
    marginBottom: 8,
    backgroundColor: colors.neutral0,
    flexDirection: 'row',
    alignItems: 'center',
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

const History: React.FC = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(filters[0].name);

  const shouldFiltersBeShown = () => {
    if (historyLists.length === 0) {
      return true;
    }

    return !isSearchFocused;
  };

  return (
    <Layout
      customContent={
        <>
          <ScrollView>
            <Header title="Trade" minimal back />
            <View style={{...styles.container, ...globalStyles.wrapper}}>
              <View style={styles.searchContainer}>
                <TextField
                  placeholder="Filter by protocol, token, event, etc..."
                  icon={MagnifySvg}
                  shadowStyle={styles.searchShadowStyle}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </View>

              {shouldFiltersBeShown() && (
                <ScrollView
                  style={styles.filters}
                  horizontal
                  showsHorizontalScrollIndicator={false}>
                  {filters.map((filter, i) => (
                    <Button
                      key={filter.label}
                      onPress={() => setSelectedFilter(filter.name)}
                      outlined={filter.name === selectedFilter}
                      size="small"
                      style={{
                        paddingLeft: filter.icon ? 6 : 12,
                        marginRight: filters.length === i + 1 ? 0 : 12,
                      }}
                      prependIcon={{
                        icon: filter.icon ?? null,
                        width: 20,
                        height: 20,
                      }}
                      shadowStyle={styles.filterShadowStyle}>
                      {filter.label}
                    </Button>
                  ))}
                </ScrollView>
              )}

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
                <NoWalletConnected shapes />
              )}
            </View>
          </ScrollView>

          {historyLists.length !== 0 && (
            <View style={styles.stickyActionContainer}>
              <Button
                outlined
                prependIcon={{icon: DownloadSvg}}
                style={globalStyles.wrapper}>
                Download CSV
              </Button>
            </View>
          )}
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchShadowStyle: {
    shadowColor: colors.neutral300,
    shadowOffset: {width: 2, height: 4},
    shadowRadius: 24,
    shadowOpacity: 0.06,
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterShadowStyle: {
    shadowColor: colors.neutral500,
    shadowOffset: {width: 2, height: 4},
    shadowRadius: 8,
    shadowOpacity: 0.06,
  },
  stickyActionContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 16,
    paddingLeft: 16,
    backgroundColor: colors.neutral0,
  },
  list: {
    marginBottom: 16,
  },
  listTitle: {
    marginBottom: 8,
    color: colors.neutral400,
    fontSize: 12,
    lineHeight: 16,
  },
});

export default History;
