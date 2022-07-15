import React from 'react';
import {View, StyleSheet} from 'react-native';
import DropShadow from 'react-native-drop-shadow';

import CustomText from './CustomText';
import TextField from './TextField';
import Button from './Button';
import IconButton from './IconButton';

import MagnifySvg from '../assets/icons/magnify.svg';
import NavBackSvg from '../assets/icons/nav-back.svg';

interface ActionType {
  type: 'text' | 'icon';
  text?: string;
  icon?: any;
  onActionPress?: () => void;
}

const Action: React.FC<{action?: ActionType}> = ({action}) => {
  return (
    <>
      {action && action.text && (
        <Button
          noPadding
          text
          textAccent="white"
          onPress={action.onActionPress}>
          {action.text}
        </Button>
      )}
      {action && !action.text && action.icon && (
        <IconButton
          icon={action.icon}
          color="#fff"
          onPress={action.onActionPress}
        />
      )}
    </>
  );
};

interface Props {
  title: string;
  action?: ActionType;
  searchable?: {isShown: boolean; onSearchToggle?: (isShown: boolean) => void};
  minimal?: boolean;
  back?: {onPressBack: () => void};
  card?: React.ReactNode;
}

const Header: React.FC<Props> = ({
  title,
  action,
  searchable,
  minimal,
  back,
  card: Card,
}) => {
  if (minimal) {
    return (
      <View style={styles.minimalHeader}>
        <View style={{minWidth: 40}}>
          {back && (
            <IconButton
              icon={NavBackSvg}
              iconSize={{width: 9, height: 16}}
              color="#fff"
              onPress={back.onPressBack}
            />
          )}
        </View>
        <View style={styles.minimalHeaderTitleContainer}>
          <CustomText style={styles.minimalHeaderTitle}>{title}</CustomText>
        </View>
        <View style={{minWidth: 40}}>
          <Action action={action} />
        </View>
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
          <Action action={action} />
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
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077FF',
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 12,
    paddingLeft: 4,
    marginBottom: 16,
  },
  minimalHeaderTitleContainer: {
    minHeight: 40,
    display: 'flex',
    justifyContent: 'center',
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
