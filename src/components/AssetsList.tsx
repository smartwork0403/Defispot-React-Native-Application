import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {VictoryGroup, VictoryLine} from 'victory-native';
import {useNavigation} from '@react-navigation/native';
import type {RootStackParamList} from './Navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {colors} from '../styles';

import Asset from './Asset';
import CustomText from './CustomText';
import Card from './Card';

const AssetsList: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({style}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={style}>
      {[...Array(20).keys()].map(k => (
        <Card
          style={styles.item}
          key={k}
          onPress={() => navigation.navigate('Asset')}>
          <Asset name="XLM" value="$253,71M" />
          <View style={styles.chart}>
            <VictoryGroup padding={{right: 27, left: 0}} width={92} height={16}>
              <VictoryLine
                style={{
                  data: {stroke: colors.green},
                }}
                data={[
                  {x: 1, y: 7},
                  {x: 2, y: 3},
                  {x: 3, y: 5},
                  {x: 4, y: 4},
                  {x: 5, y: 7},
                  {x: 6, y: 2},
                  {x: 7, y: 4},
                  {x: 8, y: 7},
                  {x: 9, y: 4},
                  {x: 10, y: 0},
                  {x: 11, y: 4},
                  {x: 12, y: 2},
                  {x: 13, y: 4},
                  {x: 14, y: 5},
                  {x: 15, y: 4},
                  {x: 16, y: 1},
                  {x: 17, y: 7},
                  {x: 18, y: 2},
                  {x: 19, y: 1},
                  {x: 20, y: 8},
                ]}
              />
            </VictoryGroup>
          </View>
          <View>
            <CustomText weight="medium" style={styles.price}>
              $3,352
            </CustomText>
            <CustomText
              weight="medium"
              style={{
                ...styles.changes,
                color: colors.red /* color: colors.green */,
              }}>
              -2.54%
            </CustomText>
          </View>
        </Card>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  chart: {
    width: 64,
    height: 16,
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
