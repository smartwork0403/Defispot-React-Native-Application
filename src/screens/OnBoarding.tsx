import React, {useState} from 'react';

import {Dimensions, StyleSheet, View} from 'react-native';
import type {RootStackParamList} from '../components/Navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import {colors} from '../styles';

import CustomText from '../components/CustomText';
import Button from '../components/Button';
import Layout from '../components/Layout';
import type {Props as ActionProps} from '../components/Button';

import UserBubbleSvg from '../assets/svg-shapes/user-bubble.svg';
import TokensListSvg from '../assets/svg-shapes/tokens-list.svg';
import CurrencyMapSvg from '../assets/svg-shapes/currency-map.svg';

const STEP_NAMES = {
  SELF_CUSTODY: 'SELF_CUSTODY',
  TOKENS: 'TOKENS',
  NATIVE_ASSETS: 'NATIVE_ASSETS',
};

const placeholder: Step = {
  name: 'placeholder',
  title: 'Title goes here',
  subtitle: 'Subtitle goes here',
  info: 'Info goes here',
  content: <CustomText>Content goes here</CustomText>,
  footerInfo: 'Footer nfo goes here',
  action: {label: 'Action'},
};

interface Action extends ActionProps {
  label: string;
}

interface Step {
  name: string;
  title: string;
  subtitle?: string;
  info: string;
  content: React.ReactNode;
  footerInfo: string;
  action: Action;
}

const OnBoarding: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const windowWidth = Dimensions.get('window').width;

  const [step, setStep] = useState(STEP_NAMES.SELF_CUSTODY);

  const steps: Step[] = [
    {
      name: STEP_NAMES.SELF_CUSTODY,
      title: 'Self custody',
      subtitle: 'How does Defispot work?',
      info: 'Defispot is a self-custodial cryptocurrency wallet, meaning only you have access to your private key.',
      content: (
        <View style={styles.selfCustodyShape}>
          <UserBubbleSvg height={280} width={280} />
        </View>
      ),
      footerInfo:
        'All sensitive information is storred only on your device. This process does not require an internet connection.',
      action: {label: 'Next', onPress: () => setStep(STEP_NAMES.TOKENS)},
    },
    {
      name: STEP_NAMES.TOKENS,
      title: '10,000+\nTokens to Trade',
      info: 'Defispot is a self-custodial cryptocurrency wallet, meaning only you have access to your private key.',
      content: (
        <View style={styles.tokensShape}>
          <TokensListSvg width={312} height={304} />
        </View>
      ),
      footerInfo:
        'All sensitive information is storred only on your device. This process does not require an internet connection.',
      action: {label: 'Next', onPress: () => setStep(STEP_NAMES.NATIVE_ASSETS)},
    },
    {
      name: STEP_NAMES.NATIVE_ASSETS,
      title: 'Native assets',
      info: 'Defispot is a self-custodial cryptocurrency wallet, meaning only you have access to your private key.',
      content: (
        <View style={styles.nativeAssetsShape}>
          <CurrencyMapSvg
            preserveAspectRatio="xMinYMin slice"
            width={windowWidth}
            height={290}
          />
        </View>
      ),
      footerInfo:
        'All sensitive information is storred only on your device. This process does not require an internet connection.',
      action: {
        label: 'Continue',
        onPress: () => navigation.navigate('GetStarted'),
      },
    },
  ];

  const currentStepIndex = steps.findIndex(st => st.name === step);
  const currentStep =
    currentStepIndex !== -1 ? steps[currentStepIndex] : placeholder;

  return (
    <Layout
      contentStyle={{padding: 0}}
      statusBarColor={colors.neutral0}
      footer={
        <View style={styles.footer}>
          <CustomText style={styles.footerInfo}>
            {currentStep.footerInfo}
          </CustomText>
          <View style={styles.steps}>
            {steps.map((s, i) => (
              <View
                key={s.name}
                style={[
                  styles.step,
                  {
                    backgroundColor:
                      s.name === step ? colors.blue : colors.neutral200,
                    marginRight: i !== steps.length ? 12 : 0,
                  },
                ]}
              />
            ))}
          </View>
          <Button size="large" {...currentStep.action}>
            {currentStep.action.label}
          </Button>
        </View>
      }
      backgroundColor={colors.neutral0}>
      <View
        style={[
          styles.content,
          {paddingTop: currentStep.name === STEP_NAMES.NATIVE_ASSETS ? 22 : 32},
        ]}>
        <CustomText weight="semi-bold" style={styles.title}>
          {currentStep.title}
        </CustomText>
        {currentStep.subtitle && (
          <CustomText style={styles.subtitle}>
            {currentStep.subtitle}
          </CustomText>
        )}
        <CustomText style={styles.info}>{currentStep.info}</CustomText>
      </View>
      {currentStep.content}
    </Layout>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 24,
  },
  footerInfo: {
    fontSize: 12,
    color: colors.neutral400,
    marginBottom: 32,
    textAlign: 'center',
  },
  steps: {
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  step: {
    height: 8,
    width: 8,
    borderRadius: 8 / 2,
  },
  content: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  title: {
    marginBottom: 16,
    fontSize: 32,
    lineHeight: 40,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.neutral400,
    marginBottom: 8,
    textAlign: 'center',
  },
  info: {
    color: colors.neutral600,
    textAlign: 'center',
  },
  selfCustodyShape: {
    paddingTop: 32,
    paddingLeft: 24,
    paddingRight: 24,
    alignItems: 'center',
  },
  tokensShape: {
    paddingTop: 32,
    paddingLeft: 24,
    paddingRight: 24,
    alignItems: 'center',
  },
  nativeAssetsShape: {
    paddingTop: 90,
  },
});

export default OnBoarding;
