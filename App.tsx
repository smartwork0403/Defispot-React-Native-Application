import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
// import RNBootSplash from 'react-native-bootsplash';

import Navigation from './src/components/Navigation';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

const App = () => {
  const [fontloaded, setfontloaded] = useState(false);

  const fetchFonts = () => {
    return Font.loadAsync({
      'CircularStd-Bold': require('./src/assets/fonts/CircularStd-Bold.ttf'),
      'CircularStd-Medium': require('./src/assets/fonts/CircularStd-Medium.ttf'),
      'CircularStd-Regular': require('./src/assets/fonts/CircularStd-Regular.ttf'),
      'Inter-Bold': require('./src/assets/fonts/Inter-Bold.ttf'),
      'Inter-Medium': require('./src/assets/fonts/Inter-Medium.ttf'),
      'Inter-Regular': require('./src/assets/fonts/Inter-Regular.ttf'),
      'Inter-SemiBold': require('./src/assets/fonts/Inter-SemiBold.ttf'),
    });
  };
  if (!fontloaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setfontloaded(true);
        }}
        onError={console.warn}
      />
    );
  }
  return (
    <NavigationContainer theme={{colors: {background: '#F7F8FA'}}}>
      <Navigation />
    </NavigationContainer>
  );
};

export default App;
