import React, {useRef} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import * as Animatable from 'react-native-animatable';

import {colors} from '../styles';

export interface Props {
  isActive: boolean;
  onToggle: (isActive: boolean) => void;
}

const Switch: React.FC<Props> = ({isActive, onToggle}) => {
  const circleRef = useRef<Animatable.View & View>(null);
  const switchRef = useRef<Animatable.View & View>(null);

  return (
    <Pressable
      style={{borderRadius: 28 / 2}}
      onPress={() => {
        onToggle(!isActive);
        if (isActive) {
          circleRef?.current?.transitionTo(
            {
              transform: [{translateX: 28}],
            },
            200,
          );
          switchRef?.current?.transitionTo(
            {
              backgroundColor: colors.blue,
            },
            200,
          );
        } else {
          circleRef?.current?.transitionTo(
            {
              transform: [{translateX: 0}],
            },
            200,
          );
          switchRef?.current?.transitionTo(
            {
              backgroundColor: colors.neutral200,
            },
            200,
          );
        }
      }}>
      <Animatable.View
        ref={switchRef}
        style={[
          styles.switch,
          {backgroundColor: isActive ? colors.blue : colors.neutral200},
        ]}>
        <Animatable.View
          ref={circleRef}
          style={[
            styles.circle,
            {transform: [{translateX: isActive ? 28 : 0}]},
          ]}
        />
      </Animatable.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: 60,
    padding: 2,
    borderRadius: 32,
    backgroundColor: colors.neutral200,
  },
  circle: {
    height: 28,
    width: 28,
    borderRadius: 28 / 2,
    backgroundColor: colors.neutral0,

    shadowColor: '#133490',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    elevation: 4,
  },
});

export default Switch;
