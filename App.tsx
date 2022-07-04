import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import Navigation from './src/components/Navigation';

const App = () => {
  return (
    <NavigationContainer theme={{colors: {background: '#fff'}}}>
      <Navigation />
    </NavigationContainer>
  );
};

export default App;
