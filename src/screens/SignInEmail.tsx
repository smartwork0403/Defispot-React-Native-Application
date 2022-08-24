import React from 'react';
import {View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../components/Navigation';
import {useNavigation} from '@react-navigation/native';

import Wizard from '../components/Wizard';
import TextField from '../components/TextField';

const STEP_NAMES = {
  SIGN_IN: 'SIGN_IN',
};

const SignInEmail: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const steps = [
    {
      name: STEP_NAMES.SIGN_IN,
      title: 'Sign in with Email',
      subtitle: 'Create magic link with email',
      actions: [{label: 'Continue', onPress: () => console.log('clicked')}],
      content: (
        <View>
          <TextField label="Email" placeholder="Enter email address" />
        </View>
      ),
    },
  ];

  return (
    <Wizard
      step={STEP_NAMES.SIGN_IN}
      steps={steps}
      onBack={() => navigation.navigate('GetStarted')}
    />
  );
};

export default SignInEmail;
