import React from 'react';

import {Dimensions, StyleSheet, View} from 'react-native';
import type {RootStackParamList} from '../components/Navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import {colors} from '../styles';

import CustomText from '../components/CustomText';
import Button from '../components/Button';
import Layout from '../components/Layout';

import DefiLogoSvg from '../assets/logos/defispo.svg';
import AppleLogoSvg from '../assets/logos/apple.svg';
import GoogleLogoSvg from '../assets/logos/google.svg';
import WalletConnectLogoSvg from '../assets/logos/wallet-connect.svg';
import EmailSvg from '../assets/icons/email.svg';
import PlusSvg from '../assets/icons/plus.svg';
import ArrowUpSvg from '../assets/icons/arrow-up.svg';

const GetStarted: React.FC = () => {
  const windowHeight = Dimensions.get('window').height;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Layout
      contentStyle={{padding: 0}}
      statusBarColor={colors.neutral0}
      accent="white"
      backgroundColor={colors.neutral0}>
      <View
        style={[
          styles.container,
          {
            minHeight: windowHeight - 24,
          },
        ]}>
        <DefiLogoSvg height={28} width={153} style={styles.logo} />
        <CustomText style={styles.title}>Wallet for the interchain</CustomText>

        <Button
          onPress={() => navigation.navigate('SignInEmail')}
          size="large"
          accent="white"
          prependIcon={{icon: EmailSvg}}
          outlined
          style={{marginBottom: 16}}>
          Sign in with Email
        </Button>
        <Button
          size="large"
          accent="white"
          prependIcon={{icon: AppleLogoSvg}}
          outlined
          style={{marginBottom: 16}}>
          Sign in with Apple Id
        </Button>
        <Button
          size="large"
          accent="white"
          prependIcon={{icon: GoogleLogoSvg}}
          outlined>
          Sign in with Google
        </Button>

        <View style={styles.or}>
          <View style={styles.orLine} />
          <CustomText style={styles.orText} weight="medium">
            or
          </CustomText>
          <View style={styles.orLine} />
        </View>

        <Button
          onPress={() => navigation.navigate('ImportCreateWallet')}
          size="large"
          accent="white"
          prependIcon={{icon: PlusSvg}}
          outlined
          style={{marginBottom: 16}}>
          Create new wallet
        </Button>
        <Button
          onPress={() => navigation.navigate('ImportCreateWallet')}
          size="large"
          accent="white"
          prependIcon={{icon: ArrowUpSvg}}
          outlined
          style={{marginBottom: 16}}>
          Import wallet
        </Button>
        <Button
          size="large"
          accent="white"
          prependIcon={{icon: WalletConnectLogoSvg}}
          outlined
          style={{marginBottom: 16}}>
          WalletConnect
        </Button>

        <CustomText style={styles.info}>
          All sensitive information is storred only on your device. This process
          does not require an internet connection.
        </CustomText>
        <Button size="large">Use Without Login</Button>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    // backgroundColor: 'red',
  },
  logo: {
    marginTop: 3,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 15,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
    color: colors.neutral500,
  },
  info: {
    fontSize: 12,
    color: colors.neutral500,
    marginBottom: 24,
    marginTop: 'auto',
    paddingTop: 30,
  },
  or: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  orLine: {
    height: 1,
    flexGrow: 1,
    backgroundColor: colors.neutral100,
  },
  orText: {
    marginLeft: 12,
    marginRight: 12,
    color: colors.neutral300,
  },
});

export default GetStarted;
