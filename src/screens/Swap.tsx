import React, {useState} from 'react';
import {View, StyleSheet, Pressable, Image} from 'react-native';
import type {
  RootStackParamList,
  TradeStackParamList,
} from '../components/Navigation';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Collapsible from 'react-native-collapsible';

import {colors, globalStyles} from '../styles';

import Button from '../components/Button';
import CustomText from '../components/CustomText';
import Layout from '../components/Layout';
import TradeCompleteModal from '../components/TradeCompleteModal';
import TradeConfirmModal from '../components/TradeConfirmModal';
import TradeModule from '../components/TradeModule';
import ToggleBar from '../components/ToggleBar';
import CollapsibleArrow from '../components/CollapsibleArrow';
import SlippageModal from '../components/SlippageModal';

import SwapSVG from '../assets/icons/swap.svg';
import ArrowRightSVG from '../assets/icons/arrow-right.svg';
import InformationReverseCircleSVG from '../assets/icons/information-reverse-circle.svg';

import {toggles} from './Deposit';

const Details: React.FC<{
  isCollapsed: boolean;
  onToggle: () => void;
  items: {title: string; value: string; isGreen?: boolean}[];
}> = ({isCollapsed, onToggle, items}) => {
  return (
    <View>
      <View style={styles.detailsHandle}>
        <View style={styles.detailsHandleIconContainer}>
          <InformationReverseCircleSVG
            height={15}
            width={15}
            color={colors.neutral400}
          />
        </View>

        <Pressable style={styles.detailsHandleBtn} onPress={() => onToggle()}>
          <CustomText weight="medium">1 USDT = 0.00005869 USDC</CustomText>
          <CustomText style={styles.detailsHandleBtnPrice}>
            {' '}
            ($1.632)
          </CustomText>
          <CollapsibleArrow
            style={{
              borderColor: colors.neutral200,
              borderWidth: 1,
              backgroundColor: colors.neutral0,
            }}
            rotate={!isCollapsed}
            color={colors.neutral400}
            startArrowAngel="down"
            finishArrowAngel="up"
          />
        </Pressable>
      </View>

      <Collapsible style={styles.collapsible} collapsed={isCollapsed}>
        <View style={styles.detailsCard}>
          {items.map(item => (
            <View style={styles.detail} key={item.title}>
              <CustomText style={styles.detailTitle}>{item.title}</CustomText>
              <View style={styles.detailValue}>
                <CustomText
                  weight="medium"
                  style={{
                    color: item.isGreen ? colors.green : colors.neutral900,
                  }}>
                  {item.value}
                </CustomText>

                <View style={styles.detailIcon}>
                  <InformationReverseCircleSVG
                    height={15}
                    width={15}
                    color={colors.neutral400}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </Collapsible>
    </View>
  );
};

const Preview: React.FC<{icon: any; title: string; subtitle: string}> = ({
  icon,
  title,
  subtitle,
}) => {
  return (
    <View style={styles.previewItem}>
      <Image source={icon} style={styles.previewItemImage} />
      <CustomText weight="medium">{title}</CustomText>
      <CustomText style={styles.previewItemSubtitle}>{subtitle}</CustomText>
    </View>
  );
};

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Swap: React.FC = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<TradeStackParamList & RootStackParamList>
    >();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isSlippageModalOpen, setIsSlippageModalOpen] = useState(false);

  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(false);

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    wait(2000).then(() => setIsRefreshing(false));
  }, []);

  const detailItems = [
    {
      title: 'Expected Output',
      value: '0 USDT',
    },
    {
      title: 'Price Impact',
      value: '%0',
      isGreen: true,
    },
    {
      title: 'Minimum received after slippage (0%)',
      value: '0 USDC',
    },
    {
      title: 'Network Fee',
      value: '$2.72',
    },
    {
      title: 'Exchange Fee',
      value: 'Free',
      isGreen: true,
    },
  ];

  return (
    <Layout
      stickyHeader
      pulldownRefresh={{isRefreshing, onRefresh}}
      header={{
        minimal: {
          title: 'Swap',
        },
      }}
      footer={
        <View>
          <View style={styles.toggleBarContainer}>
            <ToggleBar
              selected="Swap"
              items={toggles}
              onChange={value => {
                if (
                  value === 'Deposit' ||
                  value === 'Swap' ||
                  value === 'Withdraw'
                ) {
                  navigation.navigate(value);
                }
              }}
            />
          </View>
        </View>
      }>
      <View style={{...globalStyles.wrapper}}>
        <View style={styles.slippageContainer}>
          <View style={styles.slippage}>
            <CustomText style={styles.slippageText}>Slippage</CustomText>
            <CustomText weight="medium" style={styles.slippagePercent}>
              12%
            </CustomText>
            <Button text onPress={() => setIsCompleteModalOpen(true)}>
              Edit
            </Button>
          </View>

          <Pressable
            style={styles.slippageAction}
            onPress={() => setIsSlippageModalOpen(!isSlippageModalOpen)}>
            <SwapSVG
              style={{transform: [{rotate: '90deg'}]}}
              height={28}
              width={16}
              color={colors.blue}
            />
          </Pressable>
        </View>

        <TradeModule />

        <Details
          isCollapsed={isDetailsCollapsed}
          onToggle={() => setIsDetailsCollapsed(!isDetailsCollapsed)}
          items={detailItems}
        />

        <Button disabled style={styles.action} accent="black">
          Swap
        </Button>

        <View style={styles.preview}>
          <Preview
            icon={require('../assets/images/sample.png')}
            title="BNB"
            subtitle="BSC"
          />
          <View style={styles.previewArrow}>
            <ArrowRightSVG height={10} width={17} color={colors.neutral300} />
          </View>
          <Preview
            icon={require('../assets/images/sample.png')}
            title="BNB"
            subtitle="BSC"
          />
          <View style={styles.previewArrow}>
            <ArrowRightSVG height={10} width={17} color={colors.neutral300} />
          </View>
          <Preview
            icon={require('../assets/images/sample.png')}
            title="BNB"
            subtitle="BSC"
          />
        </View>
      </View>

      <TradeConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
      />
      <TradeCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
      />
      <SlippageModal
        isOpen={isSlippageModalOpen}
        onClose={() => setIsSlippageModalOpen(false)}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  slippageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  slippage: {
    backgroundColor: colors.neutral0,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 16,
    paddingLeft: 16,
    borderColor: colors.neutral200,
    borderWidth: 1,
    flexGrow: 1,
    marginRight: 16,
  },
  slippageText: {
    color: colors.neutral400,
    marginRight: 4,
  },
  slippagePercent: {
    paddingRight: 16,
    marginRight: 'auto',
  },
  slippageAction: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    borderColor: colors.neutral200,
    borderWidth: 1,
    backgroundColor: colors.neutral0,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  detailsHandle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  detailsHandleIconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  detailsHandleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
  },
  detailsHandleBtnPrice: {
    marginRight: 'auto',
    paddingRight: 16,
    color: colors.neutral500,
  },
  collapsible: {
    paddingBottom: 16,
  },
  detailsCard: {
    backgroundColor: colors.neutral0,
    padding: 16,
    paddingBottom: 0,
    borderRadius: 8,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailTitle: {
    color: colors.neutral500,
    marginRight: 16,
    flexGrow: 1,
    maxWidth: '50%',
  },
  detailValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  action: {
    marginBottom: 16,
  },
  toggleBarContainer: {
    backgroundColor: colors.neutral0,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 16,
    paddingLeft: 16,
    borderBottomColor: colors.neutral100,
    borderBottomWidth: 1,
  },
  preview: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: colors.neutral0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewItem: {
    alignItems: 'center',
    minWidth: 100,
  },
  previewItemImage: {
    height: 24,
    width: 24,
    borderRadius: 24 / 2,
    marginBottom: 8,
  },
  previewItemSubtitle: {
    color: colors.neutral400,
    fontSize: 12,
    lineHeight: 16,
  },
  previewArrow: {
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Swap;
