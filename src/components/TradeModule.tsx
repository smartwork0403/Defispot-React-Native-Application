import React from 'react';
import {View} from 'react-native';

import TradeInput from './TradeInput';

const TradeModule: React.FC = () => {
  return (
    <View>
      <TradeInput style={{marginBottom: 12}} />
      <TradeInput />
    </View>
  );
};

export default TradeModule;
