import React from 'react';
import {TouchableOpacity, View, StyleSheet} from 'react-native';
import Asset from './Asset';
import CustomText from './CustomText';
import SampleChartSvg from '../assets/icons/sample-chart.svg';

const AssetsList: React.FC = () => {
  return (
    <View style={styles.list}>
      {[...Array(20).keys()].map(k => (
        <TouchableOpacity style={styles.item} key={k}>
          <Asset />
          <SampleChartSvg style={styles.chart} />
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
