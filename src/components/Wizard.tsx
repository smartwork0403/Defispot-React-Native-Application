import React from 'react';
import {View, StyleSheet} from 'react-native';

import {colors} from '../styles';

import Button from './Button';
import Layout from './Layout';
import Progress from './Progress';
import WizardHeader from './WizardHeader';

import type {Props as ActionProps} from './Button';
import CustomText from './CustomText';

const placeholder: Step = {
  title: 'Title goes here',
  subtitle: 'Subtitle goes here',
  name: 'placeholder',
  actions: [{label: 'Action'}],
  content: <CustomText>Content goes here</CustomText>,
};

interface Action extends ActionProps {
  label: string;
}

interface Step {
  name: string;
  title: string;
  subtitle: string;
  actions: Action[];
  content: React.ReactNode;
}

interface Props {
  steps: Step[];
  step: string;
  onBack: () => void;
}

const Wizard: React.FC<Props> = ({steps = [], step, onBack}) => {
  const currentStepIndex = steps.findIndex(st => st.name === step);
  const currentStep =
    currentStepIndex !== -1 ? steps[currentStepIndex] : placeholder;
  const currentProgress =
    currentStepIndex !== -1
      ? ((currentStepIndex + 1) / steps.length) * 100
      : 50;

  return (
    <Layout
      contentStyle={{padding: 0}}
      backgroundColor={colors.neutral0}
      footer={
        <View style={styles.footer}>
          {currentStep.actions.map(action => (
            <Button key={action.label} {...action} size="large">
              {action.label}
            </Button>
          ))}
        </View>
      }
      stickyHeader
      customStickyHeader={
        <>
          {steps.length > 1 && <Progress progress={currentProgress} />}
          <WizardHeader
            onBack={onBack}
            title={currentStep.title}
            subtitle={currentStep.subtitle}
          />
        </>
      }>
      <View style={styles.content}>{currentStep.content}</View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 24,
    backgroundColor: colors.neutral0,
  },
  content: {
    padding: 24,
  },
});

export default Wizard;
