import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RNBootSplash from 'react-native-bootsplash';
import {colors} from './src/styles';

import Navigation from './src/components/Navigation';

const App = () => {
  return (
    <NavigationContainer
      theme={{colors: {background: colors.neutral50}}}
      onReady={() => RNBootSplash.hide({fade: true})}>
      <Navigation />
    </NavigationContainer>
  );
};

export default App;
