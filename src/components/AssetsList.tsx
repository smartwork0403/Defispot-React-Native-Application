import React from 'react';
import {FlatList, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import Asset from './Asset';

const AssetsList: React.FC = () => {
  return (
    <View>
      <FlatList
        data={[
          {key: 'Devin'},
          {key: 'Dan'},
          {key: 'Dominic'},
          {key: 'Jackson'},
          {key: 'James'},
          {key: 'Joel'},
          {key: 'John'},
          {key: 'Jillian'},
          {key: 'Jimmy'},
          {key: 'Julie'},
        ]}
        renderItem={({item}) => (
          <TouchableOpacity style={styles.item}>
            <Asset />
            <Text>{item.key}</Text>
          </TouchableOpacity>
        )}
      />
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
  },
});

export default AssetsList;
