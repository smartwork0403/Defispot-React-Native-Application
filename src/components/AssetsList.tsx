import React from 'react';
import {TouchableOpacity, View, StyleSheet, Image, Text} from 'react-native';
import Asset from './Asset';

const AssetsList: React.FC = () => {
  return (
    <View>
      {[...Array(20).keys()].map(k => (
        <TouchableOpacity style={styles.item} key={k}>
          <Asset />
          <Image
            source={require('../assets/images/sample.png')}
            style={styles.chart}
          />
          <View>
            <Text style={styles.price}>$3,352</Text>
            <Text
              style={{
                ...styles.changes,
                color: '#EF4444' /* color: '#00B674' */,
              }}>
              -2.54%
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 24,
    paddingLeft: 24,
    backgroundColor: 'orange',
    flexDirection: 'row',
    borderBottomColor: '#EFF0F3',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chart: {
    width: 64,
    height: 16,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 24,
    color: '#121315',
    textAlign: 'right',
  },
  changes: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    textAlign: 'right',
  },
});

export default AssetsList;
