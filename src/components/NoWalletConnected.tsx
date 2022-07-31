import React from 'react';
import {StyleSheet, View} from 'react-native';

import Button from './Button';
import CustomText from './CustomText';

import PlusSvg from '../assets/icons/plus.svg';

import ShapesSvg from '../assets/svg-shapes/no-wallet-connected.svg';

const NoWalletConnected: React.FC<{
  shapes?: boolean;
}> = ({shapes}) => {
  return (
    <View style={styles.container}>
      {shapes && (
        <View style={styles.shapesContainer}>
          <ShapesSvg height={104} width={165} />
        </View>
      )}

      <CustomText weight="semi-bold" style={styles.title}>
        No Wallet Connected
      </CustomText>
      <CustomText style={styles.subtitle}>
        Get started by connecting your wallet.
      </CustomText>
      <Button prependIcon={{icon: PlusSvg}} accent="blue">
        Connect Wallet
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 128,
    zIndex: 1,
  },
  shapesContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 12,
  },
  subtitle: {
    color: '#8D8D94',
    marginBottom: 24,
  },
});

export default NoWalletConnected;
