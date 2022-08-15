import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';

import {colors} from '../styles';

import Modal from './Modal';
import TextField from './TextField';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ScanQRCodeModal: React.FC<Props> = ({isOpen, onClose}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isEnterURL, setIsEnterURL] = useState(false);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({type, data}) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      noPadding
      stickyAction={{
        label: isEnterURL ? 'Continue' : 'Enter URL Instead',
        outlined: !isEnterURL,
        style: {borderColor: isEnterURL ? colors.blue : 'transparent'},
        onPress: () => setIsEnterURL(!isEnterURL),
      }}
      noHandle
      fullHeight
      header={{title: isEnterURL ? 'Enter Code' : 'Scan QR Code'}}>
      {isEnterURL ? (
        <View style={styles.urlContainer}>
          <TextField label="Enter URL" placeholder="URL" />
        </View>
      ) : (
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          />
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  urlContainer: {
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 24,
  },
  scannerContainer: {
    backgroundColor: 'red',
    marginLeft: 'auto',
    marginRight: 'auto',
    aspectRatio: 0.75,
    marginTop: -4,
  },
});

export default ScanQRCodeModal;
