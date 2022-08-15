import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import type {RootStackParamList} from '../components/Navigation';
import {importCreateWalletParamsList} from '../components/Navigation';
import type {ImportCreateWalletScreenProps} from '../components/Navigation';

import {colors} from '../styles';

import Wizard from '../components/Wizard';
import CustomText from '../components/CustomText';
import TextField from '../components/TextField';
import Button from '../components/Button';
import RecoveryPhrase from '../components/RecoveryPhraseModal';

import WalletBubbleSvg from '../assets/svg-shapes/wallet-bubble.svg';
import RefreshBubbleSvg from '../assets/svg-shapes/refresh-bubble.svg';
import BiometricsBubbleSvg from '../assets/svg-shapes/biometrics-bubble.svg';

const STEP_NAMES = {
  WELCOME: 'welcome',
  SECURE: 'secure',
  BACKUP: 'backup',
  // for import mode
  IMPORT: 'import',
  BIOMETRICS: 'biometrics',
};

const recoveryPhrases = [
  {
    text: 'jump',
    name: 'jump',
  },
  {
    text: 'stuff',
    name: 'stuff',
  },
  {
    text: 'brand',
    name: 'brand',
  },
  {
    text: 'wasp',
    name: 'wasp',
  },
  {
    text: 'provide',
    name: 'provide',
  },
  {
    text: 'mistake',
    name: 'mistake',
  },
  {
    text: 'gorilla',
    name: 'gorilla',
  },
  {
    text: 'tiger',
    name: 'tiger',
  },
  {
    text: 'dinner',
    name: 'dinner',
  },
  {
    text: 'peanut',
    name: 'peanut',
  },
  {
    text: 'expose',
    name: 'expose',
  },
  {
    text: 'install',
    name: 'install',
  },
];

const ImportCreateWallet: React.FC<
  ImportCreateWalletScreenProps<'ImportCreateWallet'>
> = ({
  route: {
    params: {type},
  },
}) => {
  const isImport = type === importCreateWalletParamsList.IMPORT;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [step, setStep] = useState(STEP_NAMES.WELCOME);
  const [isRecoveryPhraseModalOpen, setIsRecoveryPhraseModalOpen] =
    useState(false);

  const steps = [
    {
      name: STEP_NAMES.WELCOME,
      title: 'Create new wallet',
      subtitle: 'Create your wallet',
      actions: [{label: 'Continue', onPress: () => setStep(STEP_NAMES.SECURE)}],
      content: (
        <View style={welcomeStyles.container}>
          <WalletBubbleSvg
            height={246}
            width={246}
            style={welcomeStyles.svgShape}
          />
          <CustomText style={welcomeStyles.info}>
            You can either create a new wallet on the DefiSpot or import an
            existing one. We can neither see nor transfer your private keys.
          </CustomText>
          <Button text>Learn More</Button>
        </View>
      ),
    },
    {
      name: STEP_NAMES.SECURE,
      title: 'Secure your wallet',
      subtitle: 'Create a password',
      actions: [
        {
          label: 'Continue',
          disabled: false,
          onPress: () =>
            setStep(isImport ? STEP_NAMES.IMPORT : STEP_NAMES.BACKUP),
        },
      ],
      content: (
        <View>
          <TextField
            style={secureStyles.passwordInput}
            label="Password"
            placeholder="Enter password"
            type="password"
          />
          <TextField
            label="Confirm Password"
            placeholder="Confirm Password"
            type="password"
          />
        </View>
      ),
    },
    {
      name: STEP_NAMES.BACKUP,
      title: 'Backup your wallet',
      subtitle: 'Will ask you to write down your seed.',
      actions: [
        {
          label: 'Backup Wallet',
          onPress: () => setIsRecoveryPhraseModalOpen(true),
        },
      ],
      content: (
        <View style={backupStyles.container}>
          <RefreshBubbleSvg
            height={246}
            width={246}
            style={backupStyles.svgShape}
          />
          <CustomText style={backupStyles.info}>
            Write down your seed and store it safely. Never ever share your seed
            - your funds will be stolen. The seed is the only way to recover
            your account.
          </CustomText>

          <RecoveryPhrase
            phrases={recoveryPhrases}
            isOpen={isRecoveryPhraseModalOpen}
            onClose={() => setIsRecoveryPhraseModalOpen(false)}
            onActionPress={() => setStep(STEP_NAMES.BIOMETRICS)}
          />
        </View>
      ),
    },
    {
      name: STEP_NAMES.BIOMETRICS,
      title: 'Secure your wallet',
      subtitle: 'Enable biometrics',
      actions: [
        {
          label: 'Enable biometrics',
          disabled: false,
          style: {marginBottom: 6},
        },
        {
          label: 'Skip',
          outlined: true,
          style: {borderColor: 'transparent'},
        },
      ],
      content: (
        <View style={biometricsStyles.container}>
          <BiometricsBubbleSvg
            height={246}
            width={246}
            style={biometricsStyles.svgShape}
          />
          <CustomText style={biometricsStyles.info}>
            Enable biometric access to quickly unlock your wallet without having
            to enter a password.
          </CustomText>
        </View>
      ),
    },
  ];

  if (isImport) {
    // Replace step 3 with import wallet
    steps.splice(2, 1, {
      name: STEP_NAMES.IMPORT,
      title: 'Import Wallet',
      subtitle: 'Enter your 12-word or 24-word seed',
      actions: [
        {label: 'Add Wallet', onPress: () => setStep(STEP_NAMES.BIOMETRICS)},
      ],
      content: (
        <View>
          <TextField
            label="Seed Phrase"
            placeholder="Seed Phrase"
            style={secureStyles.passwordInput}
            textarea
          />
          <TextField label="Wallet Name" placeholder="My wallet" />
        </View>
      ),
    });
  }

  const handleBack = () => {
    if (step === STEP_NAMES.WELCOME) {
      navigation.navigate('GetStarted');
    } else if (step === STEP_NAMES.SECURE) {
      setStep(STEP_NAMES.WELCOME);
    } else if (step === STEP_NAMES.BACKUP || step === STEP_NAMES.IMPORT) {
      setStep(STEP_NAMES.SECURE);
    } else if (step === STEP_NAMES.BIOMETRICS) {
      setStep(isImport ? STEP_NAMES.IMPORT : STEP_NAMES.BACKUP);
    }
  };

  return <Wizard step={step} steps={steps} onBack={handleBack} />;
};

const welcomeStyles = StyleSheet.create({
  container: {
    paddingTop: 8,
    alignItems: 'center',
  },
  svgShape: {
    marginBottom: 16,
  },
  info: {
    marginBottom: 4,
    textAlign: 'center',
    color: colors.neutral600,
  },
});

const secureStyles = StyleSheet.create({
  passwordInput: {
    marginBottom: 16,
  },
});

const backupStyles = StyleSheet.create({
  container: welcomeStyles.container,
  svgShape: welcomeStyles.svgShape,
  info: welcomeStyles.info,
});

const biometricsStyles = StyleSheet.create({
  container: welcomeStyles.container,
  svgShape: welcomeStyles.svgShape,
  info: welcomeStyles.info,
});

export default ImportCreateWallet;
