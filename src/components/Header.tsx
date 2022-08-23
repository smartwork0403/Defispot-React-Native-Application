import React, {useRef} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {colors, config} from '../styles';

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

const Action: React.FC<{action?: ActionType; accent?: 'white'}> = ({
  action,
  accent,
}) => {
  const accentItemsColor = colors.neutral900;

  return (
    <>
      {action && action.text && (
        <Button text accent="white" onPress={action.onActionPress}>
          {action.text}
        </Button>
      )}
      {action && !action.text && action.icon && (
        <IconButton
          icon={action.icon}
          color={accentItemsColor}
          onPress={action.onActionPress}
          size="large"
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
    inputPlaceholder?: string;
    action?: {
      icon: any;
      onActionPress: () => void;
    };
  };
  minimal?: {
    title?: string;
    back?: boolean;
    action?: {
      icon?: any;
      onActionPress?: () => void;
    };
  };
  accent?: 'white';
  extended?: boolean;
}

const Header: React.FC<Props> = ({
  title,
  action,
  searchable,
  minimal,
  accent,
  extended = false,
}) => {
  const navigation = useNavigation();
  const searchableActionInputRef = useRef<TextInput>(null);

  const accentBgColor = colors.neutral0;
  const accentItemsColor = colors.neutral900;

  if (minimal) {
    return (
      <View style={{backgroundColor: accentBgColor, alignItems: 'center'}}>
        <View
          style={[
            minimalStyles.header,
            {
              borderBottomColor:
                accent === 'white' ? colors.neutral100 : colors.blue,
            },
          ]}>
          <View style={{minWidth: 40}}>
            {minimal.back && (
              <IconButton
                icon={NavBackSvg}
                iconSize={{width: 9, height: 16}}
                color={accentItemsColor}
                onPress={() => navigation.goBack()}
                size="large"
              />
            )}
          </View>
          <View style={minimalStyles.titleContainer}>
            <CustomText
              weight="medium"
              style={[minimalStyles.title, {color: accentItemsColor}]}>
              {minimal.title}
            </CustomText>
          </View>
          <View style={{minWidth: 40}}>
            {minimal.action && (
              <IconButton
                icon={minimal.action.icon}
                color={accentItemsColor}
                onPress={minimal.action.onActionPress}
                size="large"
              />
            )}
          </View>
        </View>
      </View>
    );
  }

  if (searchable) {
    return (
      <View style={{position: 'relative'}}>
        <View
          style={{
            backgroundColor: accentBgColor,
            alignItems: 'center',
          }}>
          <View
            style={[
              styles.header,
              {
                width: '100%',
                maxWidth: config.MAX_CONTENT_WIDTH,
              },
            ]}>
            {searchable.isShown ? (
              <>
                <TextField
                  placeholder={searchable?.inputPlaceholder ?? 'Search...'}
                  prependIcon={{icon: MagnifySvg}}
                  autoFocus
                  accent="grey"
                  style={{flex: 1}}
                  size="small"
                />
                <Button
                  style={{marginLeft: 16}}
                  onPress={() => {
                    searchable?.onSearchToggle?.(false);
                    // TODO: this dose not work cause of conditional rendering items, (at this time there is no <TextInput /> in the page)
                    searchableActionInputRef.current?.blur();
                  }}
                  text
                  accent="white">
                  Cancel
                </Button>
              </>
            ) : searchable.action ? (
              <>
                <TextField
                  placeholder={searchable.inputPlaceholder ?? 'Search...'}
                  prependIcon={{icon: MagnifySvg}}
                  onFocus={() => searchable.onSearchToggle?.(true)}
                  accent="grey"
                  size="small"
                  ref={searchableActionInputRef}
                  style={{flex: 1}}
                />
                <IconButton
                  icon={searchable.action.icon}
                  color={accentItemsColor}
                  onPress={() => searchable.action?.onActionPress?.()}
                  style={{marginLeft: 18}}
                  size="small"
                />
              </>
            ) : (
              <>
                <CustomText
                  weight="semi-bold"
                  style={[styles.headerTitle, {color: accentItemsColor}]}>
                  {title}
                </CustomText>
                <IconButton
                  icon={MagnifySvg}
                  color={accentItemsColor}
                  onPress={() => searchable.onSearchToggle?.(true)}
                />
              </>
            )}
          </View>
        </View>

        {extended && (
          <View style={[styles.extended, {backgroundColor: accentBgColor}]} />
        )}
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: accentBgColor,
        alignItems: 'center',
        position: 'relative',
      }}>
      <View
        style={[
          styles.header,
          {
            width: '100%',
            maxWidth: config.MAX_CONTENT_WIDTH,
          },
        ]}>
        <CustomText
          style={[styles.headerTitle, {color: accentItemsColor}]}
          weight="semi-bold">
          {title}
        </CustomText>
        <Action action={action} accent={accent} />
      </View>

      {extended && (
        <View style={[styles.extended, {backgroundColor: accentBgColor}]} />
      )}
    </View>
  );
};

const minimalStyles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    paddingLeft: 4,
    maxWidth: config.MAX_CONTENT_WIDTH,
    width: '100%',
    minHeight: 48,
    borderBottomWidth: 1,
  },
  titleContainer: {
    minHeight: 40,
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
  },
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
    paddingLeft: 16,
    minHeight: 64,
  },
  headerTitle: {
    fontSize: 24,
    lineHeight: 32,
  },
  extended: {
    height: 32,
    width: '100%',
    position: 'absolute',
    top: '100%',
  },
});

export default Header;
