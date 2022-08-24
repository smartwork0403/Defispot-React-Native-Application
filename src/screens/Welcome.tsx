import React from 'react';

import {SafeAreaView, StatusBar, StyleSheet, View, Image} from 'react-native';
import type {RootStackParamList} from '../components/Navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {colors} from '../styles';

import CustomText from '../components/CustomText';
import Button from '../components/Button';

import FlowerShapeSvg from '../assets/icons/flower-shape.svg';
import {useNavigation} from '@react-navigation/native';

const Welcome: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.neutral0}}>
      <StatusBar
        backgroundColor={colors.neutral50}
        barStyle="dark-content"
        animated
      />

      <View>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/asset-screen-screenshot.png')}
            style={styles.image}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.titleIconContainer}>
            <CustomText weight="medium" style={styles.title}>
              Trade
            </CustomText>
            <FlowerShapeSvg
              height={32}
              width={32}
              color={colors.blue}
              style={{marginLeft: 10}}
            />
          </View>
          <CustomText weight="medium" style={styles.title}>
            decentralized between blockchains
          </CustomText>

          <CustomText style={styles.info}>
            Swap all assets frictionless in a decentralized manner, earn yield
            on your native coins.
          </CustomText>

          <Button
            onPress={() => navigation.navigate('OnBoarding')}
            size="large">
            Get Started
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: colors.neutral50,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 38,
    paddingRight: 38,
    height: '100%',
  },
  image: {
    resizeMode: 'contain',
    width: 300,
    height: 620,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  infoContainer: {
    padding: 24,
    backgroundColor: colors.neutral0,
    marginTop: 'auto',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  titleIconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 48,
    lineHeight: 48,
    fontFamily: 'Aeonik-Medium',
    letterSpacing: -1,
  },
  info: {
    color: colors.neutral600,
    marginTop: 16,
    marginBottom: 24,
  },
});

export default Welcome;
