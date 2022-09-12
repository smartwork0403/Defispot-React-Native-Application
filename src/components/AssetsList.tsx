import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle, FlatList} from 'react-native';
import {VictoryGroup, VictoryLine} from 'victory-native';
import {useNavigation} from '@react-navigation/native';
import type {RootStackParamList} from './Navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {formatFloat} from '../helpers/NumberUtil';

import {colors} from '../styles';

import Asset from './Asset';
import CustomText from './CustomText';
import Card from './Card';

export interface Asset {
  cmcId: number;
  asset_full_name: string;
  symbol: string;
  chain: string;
  chain_full_name: string;
  token_address: string;
  image: string;
  market_cap: number | null;
  percent_change_24h: number;
  percent_change_7d: number;
  price: number;
  volume_24h: number;
  volume_change_24h: number;
}

const AssetsList: React.FC<{
  style?: StyleProp<ViewStyle>;
  assets: Asset[];
}> = ({style, assets = []}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <FlatList
      style={style}
      data={assets}
      keyExtractor={item => item.cmcId.toString()}
      renderItem={({item}) => (
        <Card
          style={styles.item}
          onPress={() => navigation.navigate('Asset', {id: item.cmcId})}>
          <Asset
            image={item.image}
            name={item.asset_full_name}
            value={formatFloat(item.volume_24h, 2)}
          />
          <View>
            <CustomText weight="medium" style={styles.price}>
              ${formatFloat(item.price, 2)}
            </CustomText>
            <CustomText
              weight="medium"
              style={{
                ...styles.changes,
                color: item.percent_change_24h.toString().includes('-')
                  ? colors.red
                  : colors.green,
              }}>
              {item.percent_change_24h.toFixed(2)}%
            </CustomText>
          </View>
        </Card>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  price: {
    textAlign: 'right',
  },
  changes: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'right',
  },
});

export default AssetsList;
