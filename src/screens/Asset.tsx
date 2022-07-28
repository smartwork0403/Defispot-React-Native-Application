import React, {useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
} from 'react-native';

import Layout from '../components/Layout';
import AssetHeader from '../components/AssetHeader';
import CustomText from '../components/CustomText';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import AssetChart from '../components/AssetChart';

import StartOutlinedSvg from '../assets/icons/star-outlined.svg';
import ShareSvg from '../assets/icons/share.svg';
import PlusSvg from '../assets/icons/plus.svg';
import InformationSvg from '../assets/icons/information-reverse-circle.svg';
import ArrowUpSvg from '../assets/icons/arrow-up.svg';
import FileSvg from '../assets/icons/file.svg';
import WorldSvg from '../assets/icons/world.svg';
import TwitterSvg from '../assets/icons/twitter.svg';
import RedditSvg from '../assets/icons/reddit.svg';

const Static: React.FC<{
  title: string;
  value: string;
  valueColor?: 'red' | 'green';
  valueExtra?: {hasIcon: boolean; color?: 'red' | 'green'; text: string};
  style?: StyleProp<ViewStyle>;
}> = ({title, value, valueColor, valueExtra, style}) => {
  return (
    <View style={{...styles.static, ...style}}>
      <View style={styles.staticHeader}>
        <CustomText style={styles.staticHeaderTitle}>{title}</CustomText>
        <InformationSvg height={12} width={12} color="#CFCED2" />
      </View>

      <View style={styles.staticFooter}>
        <CustomText
          style={{
            ...styles.staticFooterTitle,
            color: valueColor
              ? valueColor === 'green'
                ? '#00B674'
                : '#EF4444'
              : '#121315',
          }}>
          {value}
        </CustomText>
        {valueExtra && (
          <View style={styles.staticFooterValueContainer}>
            {valueExtra.hasIcon && (
              <ArrowUpSvg
                height={10}
                width={7}
                color={
                  valueExtra.color
                    ? valueExtra.color === 'green'
                      ? '#00B674'
                      : '#EF4444'
                    : '#A1A1A8'
                }
              />
            )}
            <CustomText
              style={{
                ...styles.staticFooterValue,
                color: valueExtra.color
                  ? valueExtra.color === 'green'
                    ? '#00B674'
                    : '#EF4444'
                  : '#A1A1A8',
              }}>
              {valueExtra.text}
            </CustomText>
          </View>
        )}
      </View>
    </View>
  );
};

const detailLinks = [
  {
    label: 'Whitepaper',
    icon: FileSvg,
  },
  {
    label: 'Offical Website',
    icon: WorldSvg,
  },
  {
    label: 'Twitter',
    icon: TwitterSvg,
  },
  {
    label: 'Reddit',
    icon: RedditSvg,
  },
];

const AssetScreen: React.FC = () => {
  const [isShowMore, setIsShowMore] = useState(false);

  return (
    <Layout
      statusBarColor="#fff"
      customContent={
        <>
          <AssetHeader />

          <ScrollView>
            <AssetChart />

            <View style={styles.content}>
              <CustomText style={styles.title}>Statistics</CustomText>
              <View style={styles.statics}>
                <Static
                  title="Market Cap"
                  value="$4.5B"
                  style={{
                    width: '50%',
                    borderRightColor: '#EFF0F3',
                    borderBottomColor: '#EFF0F3',
                    borderRightWidth: 1,
                    borderBottomWidth: 1,
                  }}
                />
                <Static
                  title="Volume (24h)"
                  value="$4.5B"
                  valueExtra={{hasIcon: true, color: 'green', text: '6.8%'}}
                  style={{
                    width: '50%',
                    borderBottomColor: '#EFF0F3',
                    borderBottomWidth: 1,
                  }}
                />
                <Static
                  title="All Time High"
                  value="$0,94"
                  style={{
                    width: '50%',
                    borderRightColor: '#EFF0F3',
                    borderBottomColor: '#EFF0F3',
                    borderRightWidth: 1,
                    borderBottomWidth: 1,
                  }}
                />
                <Static
                  title="Price Change (7D)"
                  value="-%8,57"
                  valueColor="red"
                  style={{
                    width: '50%',
                    borderBottomColor: '#EFF0F3',
                    borderBottomWidth: 1,
                  }}
                />
                <Static
                  title="Circulating Supply"
                  value="24.8B LINK"
                  valueExtra={{hasIcon: false, text: '%75  of total supply'}}
                  style={{
                    width: '100%',
                  }}
                />
              </View>

              <CustomText style={styles.title}>Details</CustomText>
              <View style={styles.details}>
                <CustomText style={styles.detailsTitle}>
                  About Stellar Lumens
                </CustomText>
                <CustomText style={styles.detailsText}>
                  {!isShowMore ? (
                    <>
                      Chainlink (LINK) is an Ethereum token that powers the
                      Chainlink decentralized oracle network. This network
                      allows smart contracts...
                    </>
                  ) : (
                    <>
                      Chainlink (LINK) is an Ethereum token that powers the
                      Chainlink decentralized oracle network. This network
                      allows smart contracts on Ethereum to securely connect to
                      external data sources, APIs, and payment systems.
                    </>
                  )}
                </CustomText>

                {!isShowMore && (
                  <Pressable
                    style={styles.showMore}
                    onPress={() => setIsShowMore(true)}>
                    <CustomText style={styles.showMoreText}>
                      Show More
                    </CustomText>
                  </Pressable>
                )}

                <View style={styles.detailsDivider} />

                {detailLinks.map(link => (
                  <Pressable style={styles.detailsLink} key={link.label}>
                    <View style={styles.detailsLinkIconContainer}>
                      <link.icon height={12} width={12} color="#0077FF" />
                    </View>
                    <CustomText style={styles.detailsLinkText}>
                      {link.label}
                    </CustomText>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.stickyActions}>
            <Button
              outlined
              prependIcon={{icon: PlusSvg}}
              style={{marginRight: 16}}>
              Add Liquidity
            </Button>
            <Button accent="black" style={{marginRight: 16}}>
              Trade
            </Button>
            <IconButton
              icon={StartOutlinedSvg}
              color="#A1A1A8"
              style={{marginRight: 8}}
            />
            <IconButton icon={ShareSvg} color="#A1A1A8" />
          </View>
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  statics: {
    borderWidth: 1,
    borderColor: '#EFF0F3',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  static: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 24,
    paddingLeft: 24,
  },
  staticHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  staticHeaderTitle: {
    fontSize: 12,
    lineHeight: 16,
    color: '#A1A1A8',
    marginRight: 8,
  },
  staticFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  staticFooterTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  staticFooterValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staticFooterValue: {
    fontSize: 12,
    lineHeight: 16,
    color: '#A1A1A8',
    marginLeft: 9,
    fontFamily: 'Inter-Medium',
  },
  details: {
    backgroundColor: '#fff',
    padding: 24,
    paddingBottom: 12,
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  detailsText: {
    color: '#62626D',
  },
  showMore: {marginTop: 8},
  showMoreText: {
    color: '#0077FF',
    fontFamily: 'Inter-Medium',
  },
  detailsDivider: {
    height: 1,
    backgroundColor: '#EFF0F3',
    marginTop: 16,
    marginBottom: 16,
  },
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsLinkIconContainer: {
    height: 20,
    width: 20,
    marginRight: 8,
    justifyContent: 'center',
    alignContent: 'center',
  },
  detailsLinkText: {
    fontFamily: 'Inter-Medium',
    color: '#0077FF',
  },
  stickyActions: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 12,
    paddingLeft: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AssetScreen;
