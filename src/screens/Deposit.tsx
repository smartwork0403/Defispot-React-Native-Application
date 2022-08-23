import React from 'react';
import {View, StyleSheet, GestureResponderEvent} from 'react-native';
import type {
  RootStackParamList,
  TradeStackParamList,
} from '../components/Navigation';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {colors} from '../styles';

import Layout from '../components/Layout';
import CustomText from '../components/CustomText';
import CollapsibleArrow from '../components/CollapsibleArrow';
import Card from '../components/Card';
import ToggleBar from '../components/ToggleBar';

import WorldSvg from '../assets/icons/world.svg';
import ShoppingCartSvg from '../assets/icons/shopping-cart.svg';

const CardItem: React.FC<{
  title: string;
  icon?: any;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}> = ({title, icon: Icon, onPress}) => {
  return (
    <Card style={cardStyles.card} onPress={onPress}>
      {Icon && (
        <View style={cardStyles.cardIconContainer}>
          <Icon height={15} width={15} color={colors.neutral400} />
        </View>
      )}
      <CustomText weight="medium" style={cardStyles.cardTitle}>
        {title}
      </CustomText>
      <CollapsibleArrow rotate={false} startArrowAngel="right" />
    </Card>
  );
};

export const toggles = [
  {
    value: 'Swap',
    label: 'Swap',
  },
  {
    value: 'Deposit',
    label: 'Deposit',
  },
  {
    value: 'Withdraw',
    label: 'Withdraw',
  },
];

const Deposit: React.FC = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<TradeStackParamList & RootStackParamList>
    >();

  return (
    <Layout
      header={{
        minimal: {
          title: 'Deposit',
        },
      }}
      footer={
        <View>
          <View style={styles.toggleBarContainer}>
            <ToggleBar
              selected="Deposit"
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
      <CardItem
        title="Deposit with network"
        icon={WorldSvg}
        onPress={() => navigation.navigate('DepositWithNetwork')}
      />
      <CardItem title="Buy crypto with fiat" icon={ShoppingCartSvg} />
    </Layout>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  cardIconContainer: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    flexGrow: 1,
    marginLeft: 4,
  },
});

const styles = StyleSheet.create({
  toggleBarContainer: {
    backgroundColor: colors.neutral0,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 16,
    paddingLeft: 16,
    borderBottomColor: colors.neutral100,
    borderBottomWidth: 1,
  },
});

export default Deposit;
