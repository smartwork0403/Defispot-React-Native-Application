import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';

const Asset: React.FC = () => {
  return (
    <View style={styles.asset}>
      <Image source={require('../assets/images/sample.png')} />
      <View>
        <Text>XLM</Text>
        <Text>$253,71M</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  asset: {},
});

export default Asset;
