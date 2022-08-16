import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

import {colors} from '../styles';

import Layout from '../components/Layout';
import Button from '../components/Button';
import Card from '../components/Card';
import CustomText from '../components/CustomText';
import TextField from '../components/TextField';
import PrivateKeysInfoModal from '../components/PrivateKeysInfoModal';

const ExportPrivateKey: React.FC = () => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  return (
    <Layout
      accent="white"
      footer={
        <View style={styles.footer}>
          <Button size="large">Export key to clipboard</Button>
        </View>
      }
      header={{minimal: {title: 'Export Private Key', back: true}}}>
      <Card style={styles.card}>
        <CustomText weight="medium" style={styles.infoTitle}>
          Do NOT use your private keys
        </CustomText>
        <CustomText style={styles.infoText}>
          unless you fully understand DefiSpot’s on-chain protocol. You may lose
          funds by taking improper actions. Importantly:
        </CustomText>
        <Button text onPress={() => setIsInfoModalOpen(true)}>
          Show More
        </Button>
      </Card>

      <Card style={styles.card}>
        <CustomText weight="medium" style={styles.walletTitle}>
          Your DefiSpot wallet address
        </CustomText>
        <CustomText>2MxdyKzqM3442GWD8ZtmCMBDugrLa22</CustomText>
      </Card>

      <Card style={styles.card}>
        <CustomText weight="medium">
          Enter a password to encrypt your key export:
        </CustomText>
        <TextField
          placeholder="Password"
          type="password"
          style={styles.password}
        />
        <CustomText style={styles.passwordInfo}>
          The key can be imported into the DefiSpot station desktop browser
          extension, using the “Import Wallet” option.
        </CustomText>
      </Card>

      <PrivateKeysInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingRight: 20,
  },
  infoTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  infoText: {
    color: colors.neutral600,
    marginBottom: 8,
  },
  walletTitle: {
    color: colors.neutral500,
  },
  passwordInfo: {
    color: colors.neutral500,
  },
  password: {
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
});

export default ExportPrivateKey;
