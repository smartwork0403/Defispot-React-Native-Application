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
import CollapsibleArrow from './CollapsibleArrow';

const AssetsList: React.FC<{
  style?: StyleProp<ViewStyle>;
}> = ({style}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={style}>
      {[...Array(5).keys()].map(k => (
        <Card
          style={styles.item}
          key={k}
          onPress={() => navigation.navigate('Asset')}>
          <Asset name="XLM" value="$253,71M" />
          <CollapsibleArrow rotate={false} startArrowAngel="right" />
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
});

export default AssetsList;
