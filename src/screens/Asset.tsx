import React, {useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Pressable,
} from 'react-native';
import {colors, globalStyles} from '../styles';

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
    <View style={[styles.static, style]}>
      <View style={styles.staticHeader}>
        <CustomText style={styles.staticHeaderTitle}>{title}</CustomText>
        <InformationSvg height={12} width={12} color={colors.neutral300} />
      </View>

      <View style={styles.staticFooter}>
        <CustomText
          weight="medium"
          style={{
            ...styles.staticFooterTitle,
            color: valueColor
              ? valueColor === 'green'
                ? colors.green
                : colors.red
              : colors.neutral900,
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
                      ? colors.green
                      : colors.red
                    : colors.neutral400
                }
              />
            )}
            <CustomText
              weight="medium"
              style={{
                ...styles.staticFooterValue,
                color: valueExtra.color
                  ? valueExtra.color === 'green'
                    ? colors.green
                    : colors.red
                  : colors.neutral400,
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
      statusBarColor={colors.neutral0}
      customContent={
        <>
          <AssetHeader />

          <ScrollView style={globalStyles.wrapper}>
            <AssetChart />

            <View style={styles.content}>
              <CustomText weight="medium" style={styles.title}>
                Statistics
              </CustomText>
              <View style={styles.statics}>
                <Static
                  title="Market Cap"
                  value="$4.5B"
                  style={{
                    width: '50%',
                    borderRightColor: colors.neutral100,
                    borderBottomColor: colors.neutral100,
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
                    borderBottomColor: colors.neutral100,
                    borderBottomWidth: 1,
                  }}
                />
                <Static
                  title="All Time High"
                  value="$0,94"
                  style={{
                    width: '50%',
                    borderRightColor: colors.neutral100,
                    borderBottomColor: colors.neutral100,
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
                    borderBottomColor: colors.neutral100,
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

              <CustomText weight="medium" style={styles.title}>
                Details
              </CustomText>
              <View style={styles.details}>
                <CustomText weight="medium" style={styles.detailsTitle}>
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
                    <CustomText weight="medium" style={styles.showMoreText}>
                      Show More
                    </CustomText>
                  </Pressable>
                )}

                <View style={styles.detailsDivider} />

                {detailLinks.map(link => (
                  <Pressable style={styles.detailsLink} key={link.label}>
                    <View style={styles.detailsLinkIconContainer}>
                      <link.icon height={12} width={12} color={colors.blue} />
                    </View>
                    <CustomText weight="medium" style={styles.detailsLinkText}>
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
              color={colors.neutral400}
              style={{marginRight: 8}}
            />
            <IconButton icon={ShareSvg} color={colors.neutral400} />
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
    marginBottom: 16,
  },
  statics: {
    borderWidth: 1,
    borderColor: colors.neutral100,
    borderRadius: 8,
    backgroundColor: colors.neutral0,
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
    color: colors.neutral400,
    marginRight: 8,
  },
  staticFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  staticFooterTitle: {
    fontSize: 16,
  },
  staticFooterValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  staticFooterValue: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.neutral400,
    marginLeft: 9,
  },
  details: {
    backgroundColor: colors.neutral0,
    padding: 24,
    paddingBottom: 12,
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  detailsText: {
    color: colors.neutral600,
  },
  showMore: {marginTop: 8},
  showMoreText: {
    color: colors.blue,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: colors.neutral100,
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
    color: colors.blue,
  },
  stickyActions: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 12,
    paddingLeft: 16,
    backgroundColor: colors.neutral0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AssetScreen;
