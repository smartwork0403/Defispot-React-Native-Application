import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RNBootSplash from 'react-native-bootsplash';

import Navigation from './src/components/Navigation';

const App = () => {
  return (
    <NavigationContainer
      theme={{colors: {background: '#F7F8FA'}}}
      onReady={() => RNBootSplash.hide({fade: true})}>
      <Navigation />
    </NavigationContainer>
  );
};

export default App;
