import React, {useRef, useState} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Collapsible from 'react-native-collapsible';
import * as Animatable from 'react-native-animatable';
import {colors} from '../styles';

import CollapsibleArrow from './CollapsibleArrow';

const CollapsibleCard: React.FC<{
  style?: StyleProp<ViewStyle>;
  top?: React.ReactNode;
  bottom?: React.ReactNode;
  startArrowAngel?: 'down' | 'right';
  finishArrowAngel?: 'up' | 'right';
}> = ({style, top, bottom, startArrowAngel, finishArrowAngel}) => {
  const topRef = useRef<Animatable.View & View>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <View style={[style]}>
      <Pressable
        onPress={() => {
          setIsCollapsed(!isCollapsed);
          if (isCollapsed) {
            topRef?.current?.transitionTo(
              {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                borderBottomColor: colors.neutral0,
              },
              330,
            );
          } else {
            topRef?.current?.transitionTo(
              {
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                borderBottomColor: colors.neutral100,
              },
              330,
            );
          }
        }}>
        <Animatable.View ref={topRef} style={styles.top}>
          {top && top}

          <CollapsibleArrow
            rotate={!isCollapsed}
            startArrowAngel={startArrowAngel}
            finishArrowAngel={finishArrowAngel}
          />
        </Animatable.View>
      </Pressable>

      <Collapsible style={styles.bottom} collapsed={isCollapsed}>
        {bottom && bottom}
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  top: {
    backgroundColor: colors.neutral0,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral100,
    borderBottomColor: colors.neutral100,
  },
  bottom: {
    backgroundColor: colors.neutral0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 16,
    paddingTop: 0,
    borderWidth: 1,
    borderColor: colors.neutral100,
    borderTopWidth: 0,
  },
});

export default CollapsibleCard;
