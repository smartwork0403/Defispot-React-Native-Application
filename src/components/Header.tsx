import React from 'react';
import {View, StyleSheet} from 'react-native';
import DropShadow from 'react-native-drop-shadow';

import CustomText from './CustomText';
import TextField from './TextField';
import Button from './Button';
import IconButton from './IconButton';

import MagnifySvg from '../assets/icons/magnify.svg';

interface Props {
  title: string;
  action?: {
    type: 'text' | 'icon';
    text?: string;
    icon?: any;
    onActionPress?: () => void;
  };
  searchable?: {isShown: boolean; onSearchToggle?: (isShown: boolean) => void};
  minimal?: boolean;
  card?: React.ReactNode;
}

const Header: React.FC<Props> = ({
  title,
  action,
  searchable,
  minimal,
  card: Card,
}) => {
  if (minimal) {
    return (
      <View style={styles.minimalHeader}>
        <CustomText style={styles.minimalHeaderTitle}>Trade</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      {searchable ? (
        <View style={{...styles.headerTop, paddingBottom: 45}}>
          {searchable.isShown ? (
            <>
              <TextField placeholder="Search..." icon={MagnifySvg} autoFocus />
              <Button
                style={styles.searchCancel}
                onPress={() => searchable.onSearchToggle?.(false)}
                noPadding
                text
                textAccent="white">
                Cancel
              </Button>
            </>
          ) : (
            <>
              <CustomText style={styles.headerTitle}>{title}</CustomText>
              <IconButton
                icon={MagnifySvg}
                color="#fff"
                onPress={() => searchable.onSearchToggle?.(true)}
              />
            </>
          )}
        </View>
      ) : (
        <View style={{...styles.headerTop, paddingBottom: Card ? 45 : 16}}>
          <CustomText style={styles.headerTitle}>{title}</CustomText>
          {action && action.text && (
            <Button
              noPadding
              text
              textAccent="white"
              onPress={action.onActionPress}>
              History
            </Button>
          )}
          {action &&
            !action.text &&
            action.icon(
              <IconButton
                icon={action.icon}
                color="#fff"
                onPress={action.onActionPress}
              />,
            )}
        </View>
      )}

      {Card && (
        <View style={styles.headerBottom}>
          <DropShadow
            style={{
              shadowColor: '#8d8d94',
              shadowOffset: {width: 2, height: 4},
              shadowRadius: 8,
              shadowOpacity: 0.06,
            }}>
            <View style={styles.card}>{Card}</View>
          </DropShadow>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  minimalHeader: {
    justifyContent: 'center',
    backgroundColor: '#0077FF',
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 24,
    paddingLeft: 24,
    marginBottom: 16,
  },
  minimalHeaderTitle: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 18,
  },
  header: {
    marginBottom: 16,
  },
  headerTop: {
    backgroundColor: '#0077FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingRight: 24,
    paddingLeft: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 32,
    color: '#FFFFFF',
  },
  searchCancel: {
    marginLeft: 16,
  },
  headerBottom: {
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: -32,
  },
  card: {
    backgroundColor: '#fff',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 8,
  },
});

export default Header;
