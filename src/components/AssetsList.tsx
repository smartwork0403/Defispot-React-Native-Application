import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import {VictoryGroup, VictoryLine} from 'victory-native';

import Asset from './Asset';
import CustomText from './CustomText';

const AssetsList: React.FC = () => {
  return (
    <View style={styles.list}>
      {[...Array(20).keys()].map(k => (
        <TouchableOpacity style={styles.item} key={k}>
          <Asset name="XLM" value="$253,71M" />
          <View style={styles.chart}>
            <VictoryGroup padding={{right: 27, left: 0}} width={92} height={16}>
              <VictoryLine
                style={{
                  data: {stroke: '#00B674'},
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
            <CustomText style={styles.price}>$3,352</CustomText>
            <CustomText
              style={{
                ...styles.changes,
                color: '#EF4444' /* color: '#00B674' */,
              }}>
              -2.54%
            </CustomText>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingRight: 14,
    paddingLeft: 14,
    paddingBottom: 2,
  },
  item: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 16,
    paddingLeft: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderColor: '#EFF0F3',
    borderWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chart: {
    width: 64,
    height: 16,
  },
  price: {
    fontFamily: 'Inter-Medium',
    textAlign: 'right',
  },
  changes: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'right',
  },
});

export default AssetsList;
