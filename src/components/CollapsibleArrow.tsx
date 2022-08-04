import React, {useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {colors} from '../styles';

import ChevronDownSvg from '../assets/icons/chevron-down.svg';

const CollapsibleArrow: React.FC<{
  startArrowAngel?: 'down' | 'right';
  finishArrowAngel?: 'up' | 'right';
  rotate?: boolean;
}> = ({startArrowAngel = 'down', finishArrowAngel = 'up', rotate}) => {
  const ref = useRef<Animatable.View & View>(null);

  const getStartAngel = () => {
    if (startArrowAngel === 'down') {
      return '0deg';
    }

    return '-90deg';
  };

  const getFinishAngel = () => {
    if (finishArrowAngel === 'up') {
      if (startArrowAngel === 'right') {
        return '-180deg';
      }

      return '180deg';
    }

    return '-90deg';
  };

  useEffect(() => {
    if (rotate) {
      ref?.current?.transitionTo(
        {
          transform: [
            {
              rotate: getFinishAngel(),
            },
          ],
        },
        330,
      );
    } else {
      ref?.current?.transitionTo(
        {
          transform: [
            {
              rotate: getStartAngel(),
            },
          ],
        },
        330,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotate]);

  return (
    <Animatable.View
      style={{
        ...styles.btn,
        transform: [{rotate: startArrowAngel === 'right' ? '-90deg' : '0deg'}],
      }}
      ref={ref}>
      <ChevronDownSvg height={4} width={7} color={colors.neutral900} />
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  btn: {
    marginLeft: 12,
    height: 24,
    width: 24,
    borderRadius: 24 / 2,
    backgroundColor: colors.neutral100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CollapsibleArrow;
