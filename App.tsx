import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RNBootSplash from 'react-native-bootsplash';
import {Provider as ReduxProvider} from 'react-redux';
import {store as reduxStore} from './src/redux/store';

import Navigation from './src/components/Navigation';

const App = () => {
  return (
    <NavigationContainer
      theme={{colors: {background: '#F5F5F5'}}}
      onReady={() => RNBootSplash.hide({fade: true})}>
      <ReduxProvider store={reduxStore}>
        <Navigation />
      </ReduxProvider>
    </NavigationContainer>
  );
};

export default App;
