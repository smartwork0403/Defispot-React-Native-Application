import React from 'react';
import {
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import AssetsList from '../components/AssetsList';
import Button from '../components/Button';
import Header from '../components/Header';
import MarketsStats from '../components/MarketsStats';

const HeaderSearchButton: React.FC<{
  onPress: ((event: GestureResponderEvent) => void) | undefined;
}> = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>search</Text>
    </TouchableOpacity>
  );
};

const MarketsScreen: React.FC = () => {
  return (
    <View>
      <Header
        title="Markets"
        action={<HeaderSearchButton onPress={() => {}} />}
      />
      <MarketsStats />

      <View style={styles.filters}>
        <View style={styles.filter}>
          <Button accent="grey" size="small">
            All
          </Button>
        </View>
        <View style={styles.filter}>
          <Button size="small">*</Button>
        </View>
        <View style={styles.filter}>
          <Button size="small">Layer 1</Button>
        </View>
        <View style={styles.filter}>
          <Button size="small">DeFi</Button>
        </View>
        <Button size="small">Sort by</Button>
      </View>

      <AssetsList />
    </View>
  );
};

const styles = StyleSheet.create({
  filters: {
    paddingTop: 24,
    paddingRight: 24,
    paddingLeft: 24,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  filter: {
    marginRight: 12,
  },
});

export default MarketsScreen;
