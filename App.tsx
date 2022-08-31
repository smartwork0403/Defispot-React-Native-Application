import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
// import * as Random from 'expo-random';
import {Provider as ReduxProvider} from 'react-redux';
import {store as reduxStore} from './src/redux/store';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

import Navigation from './src/components/Navigation';

import {colors} from './src/styles';

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const fetchFonts = () => {
    return Font.loadAsync({
      'CircularStd-Bold': require('./src/assets/fonts/CircularStd-Bold.ttf'),
      'CircularStd-Medium': require('./src/assets/fonts/CircularStd-Medium.ttf'),
      'CircularStd-Regular': require('./src/assets/fonts/CircularStd-Regular.ttf'),
      'Inter-Bold': require('./src/assets/fonts/Inter-Bold.ttf'),
      'Inter-Medium': require('./src/assets/fonts/Inter-Medium.ttf'),
      'Inter-Regular': require('./src/assets/fonts/Inter-Regular.ttf'),
      'Inter-SemiBold': require('./src/assets/fonts/Inter-SemiBold.ttf'),
      'Aeonik-Regular': require('./src/assets/fonts/Aeonik-Regular.ttf'),
      'Aeonik-Medium': require('./src/assets/fonts/Aeonik-Medium.ttf'),
      'Aeonik-Bold': require('./src/assets/fonts/Aeonik-Bold.ttf'),
    });
  };

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontsLoaded(true);
        }}
        onError={console.warn}
      />
    );
  }
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={{colors: {background: colors.neutral50}}}>
        <ReduxProvider store={reduxStore}>
          <Navigation />
        </ReduxProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
