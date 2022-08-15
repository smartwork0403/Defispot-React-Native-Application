import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {colors} from '../styles';

import Layout from '../components/Layout';
import Button from '../components/Button';
import CustomText from '../components/CustomText';
import ScanQRCodeModal from '../components/ScanQRCodeModal';

import ConnectWalletSvg from '../assets/svg-shapes/connect-wallet.svg';

const ConnectWallet: React.FC = () => {
  const [scanQRCodeModal, setScanQRCodeModal] = useState(false);

  return (
    <Layout
      backgroundColor={colors.neutral0}
      contentStyle={{padding: 0}}
      header={{accent: 'white', minimal: {back: true, title: 'Connect Wallet'}}}
      accent="white"
      footer={
        <View style={styles.footer}>
          <Button size="large" onPress={() => setScanQRCodeModal(true)}>
            Scan QR Code
          </Button>
        </View>
      }>
      <View style={styles.content}>
        <ConnectWalletSvg width={'100%'} height={337} />
        <CustomText weight="bold" style={styles.title}>
          Connect to Web3
        </CustomText>
        <CustomText style={styles.subtitle}>
          Scan any WalletConnect code to start.
        </CustomText>
      </View>

      <ScanQRCodeModal
        isOpen={scanQRCodeModal}
        onClose={() => setScanQRCodeModal(false)}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 24,
  },
  content: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingRight: 20,
    paddingLeft: 20,
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
    fontSize: 24,
    lineHeight: 32,
    marginTop: -32,
  },
  subtitle: {
    color: colors.neutral500,
  },
});

export default ConnectWallet;
