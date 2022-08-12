import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {colors} from '../styles';

const Progress: React.FC<{progress: number}> = ({progress = 0}) => {
  const ref = useRef<Animatable.View & View>(null);
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    const percent = Math.ceil((windowWidth / 100) * progress);

    ref?.current?.transitionTo({
      width: percent,
    });
  }, [progress, windowWidth]);

  return (
    <View style={styles.bar}>
      <Animatable.View ref={ref} style={styles.progress} />
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    height: 4,
    width: '100%',
    position: 'relative',
    backgroundColor: colors.neutral100,
  },
  progress: {
    backgroundColor: colors.blue,
    position: 'absolute',
    left: 0,
    height: '100%',
  },
});

export default Progress;
