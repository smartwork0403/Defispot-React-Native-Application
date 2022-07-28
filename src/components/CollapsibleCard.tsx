import React, {useState} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Collapsible from 'react-native-collapsible';

import ChevronDownSvg from '../assets/icons/chevron-down.svg';

const CollapsibleCard: React.FC<{
  style?: StyleProp<ViewStyle>;
  top?: React.ReactNode;
  bottom?: React.ReactNode;
  initArrowAngel: 'down' | 'right';
}> = ({style, top, bottom, initArrowAngel = 'down'}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <View style={{...style}}>
      <Pressable
        style={styles.top}
        onPress={() => setIsCollapsed(!isCollapsed)}>
        {top && top}

        <View style={styles.topButton}>
          <ChevronDownSvg
            height={4}
            width={7}
            color="#121315"
            style={{
              transform: [
                {
                  rotate: isCollapsed
                    ? initArrowAngel === 'down'
                      ? '0deg'
                      : '-90deg'
                    : '180deg',
                },
              ],
            }}
          />
        </View>
      </Pressable>

      <Collapsible style={styles.bottom} collapsed={isCollapsed}>
        {bottom && bottom}
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  top: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EFF0F3',
  },
  topButton: {
    marginLeft: 12,
    height: 24,
    width: 24,
    borderRadius: 24 / 2,
    backgroundColor: '#EFF0F3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {backgroundColor: 'red'},
});

export default CollapsibleCard;
