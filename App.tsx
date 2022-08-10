import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {colors} from './src/styles';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import Navigation from './src/components/Navigation';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import {CustomStatusBar} from './src/components/CustomStatusBar';

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
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor={colors.blue} />
      <NavigationContainer theme={{colors: {background: colors.neutral50}}}>
        <Navigation />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
