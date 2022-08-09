import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {colors, config, globalStyles} from '../styles';

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
          color={colors.neutral0}
          onPress={action.onActionPress}
        />
      )}
    </>
  );
};

export interface Props {
  title?: string;
  action?: ActionType;
  searchable?: {
    isShown?: boolean;
    onSearchToggle?: (isShown: boolean) => void;
    persistence?: {actionIcon: any; onActionIconClick: () => void};
    inputPlaceholder?: string;
  };
  minimal?: boolean;
  back?: boolean;
  card?: React.ReactNode;
  cardStyle?: StyleProp<ViewStyle>;
}

const Header: React.FC<Props> = ({
  title,
  action,
  searchable,
  minimal,
  back,
  card: Card,
  cardStyle,
}) => {
  const navigation = useNavigation();

  if (minimal) {
    return (
      <View style={{backgroundColor: colors.blue, alignItems: 'center'}}>
        <View style={styles.minimalHeader}>
          <View style={{minWidth: 40}}>
            {back && (
              <IconButton
                icon={NavBackSvg}
                iconSize={{width: 9, height: 16}}
                color={colors.neutral0}
                onPress={() => navigation.goBack()}
              />
            )}
          </View>
          <View style={styles.minimalHeaderTitleContainer}>
            <CustomText weight="medium" style={styles.minimalHeaderTitle}>
              {title}
            </CustomText>
          </View>
          <View style={{minWidth: 40}}>
            <Action action={action} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      {searchable ? (
        <View
          style={{
            backgroundColor: colors.blue,
            alignItems: 'center',
          }}>
          <View
            style={{
              ...styles.headerTop,
              paddingBottom: 45,
              width: '100%',
              maxWidth: config.MAX_CONTENT_WIDTH,
            }}>
            {searchable.persistence ? (
              <>
                <TextField
                  placeholder={searchable.inputPlaceholder ?? 'Search...'}
                  icon={MagnifySvg}
                  style={{backgroundColor: colors.neutral50}}
                />
                <IconButton
                  icon={searchable.persistence.actionIcon}
                  color={colors.neutral0}
                  onPress={() => searchable.persistence?.onActionIconClick?.()}
                  style={{marginLeft: 16}}
                />
              </>
            ) : searchable.isShown ? (
              <>
                <TextField
                  placeholder={searchable.inputPlaceholder ?? 'Search...'}
                  icon={MagnifySvg}
                  autoFocus
                  style={{backgroundColor: colors.neutral50}}
                />
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
                <CustomText weight="semi-bold" style={styles.headerTitle}>
                  {title}
                </CustomText>
                <IconButton
                  icon={MagnifySvg}
                  color={colors.neutral0}
                  onPress={() => searchable.onSearchToggle?.(true)}
                />
              </>
            )}
          </View>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: colors.blue,
            alignItems: 'center',
          }}>
          <View
            style={{
              ...styles.headerTop,
              paddingBottom: Card ? 45 : 16,
              width: '100%',
              maxWidth: config.MAX_CONTENT_WIDTH,
            }}>
            <CustomText style={styles.headerTitle}>{title}</CustomText>
            <Action action={action} />
          </View>
        </View>
      )}

      {Card && (
        <View style={styles.headerBottom}>
          <View style={[styles.card, globalStyles.shadow, cardStyle]}>
            {Card}
          </View>
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
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 12,
    paddingLeft: 4,
    maxWidth: config.MAX_CONTENT_WIDTH,
    width: '100%',
  },
  minimalHeaderTitleContainer: {
    minHeight: 40,
    display: 'flex',
    justifyContent: 'center',
  },
  minimalHeaderTitle: {
    color: colors.neutral0,
    textAlign: 'center',
    fontSize: 18,
  },
  header: {},
  headerTop: {
    backgroundColor: colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingRight: 24,
    paddingLeft: 24,
  },
  headerTitle: {
    fontSize: 24,
    lineHeight: 32,
    color: colors.neutral0,
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
    backgroundColor: colors.neutral0,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 8,
    ...globalStyles.wrapper,
    maxWidth: config.MAX_CONTENT_WIDTH - 32,
  },
});

export default Header;
