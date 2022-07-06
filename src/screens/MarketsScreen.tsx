import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AssetsList from '../components/AssetsList';
import Button from '../components/Button';
import Header from '../components/Header';
import MarketsStats from '../components/MarketsStats';
import Select from '../components/Select';
import TextField from '../components/TextField';

const SearchView: React.FC<{onCancel: () => void}> = ({onCancel}) => {
  return (
    <>
      <View style={searchStyles.container}>
        <TextField icon placeholder="Search..." autoFocus />
        <TouchableOpacity style={searchStyles.cancelBtn} onPress={onCancel}>
          <Text style={searchStyles.cancel}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <AssetsList />
      </ScrollView>
    </>
  );
};

const searchStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 24,
    paddingLeft: 24,
    marginBottom: 16,
  },
  cancelBtn: {
    marginLeft: 16,
  },
  cancel: {
    color: '#0077FF',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 24,
  },
});

const MainView: React.FC<{onPressSearch: () => void}> = ({onPressSearch}) => {
  return (
    <>
      <Header
        title="Markets"
        action={
          <TouchableOpacity onPress={onPressSearch}>
            <Text>search</Text>
          </TouchableOpacity>
        }
      />
      <MarketsStats />

      <View style={mainStyles.filters}>
        <View style={mainStyles.filter}>
          <Button accent="grey" size="small">
            All
          </Button>
        </View>
        <View style={mainStyles.filter}>
          <Button size="small">*</Button>
        </View>
        <View style={mainStyles.filter}>
          <Button size="small">Layer 1</Button>
        </View>
        <View style={mainStyles.filter}>
          <Button size="small">DeFi</Button>
        </View>
        <Button size="small">Sort by</Button>
      </View>

      <Select />

      <AssetsList />
    </>
  );
};

const mainStyles = StyleSheet.create({
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

const MarketsScreen: React.FC = () => {
  const [isSearchShown, setIsSearchShown] = useState(false);

  return (
    <>
      {isSearchShown ? (
        <SearchView onCancel={() => setIsSearchShown(false)} />
      ) : (
        <ScrollView>
          <MainView onPressSearch={() => setIsSearchShown(true)} />
        </ScrollView>
      )}
    </>
  );
};

export default MarketsScreen;
