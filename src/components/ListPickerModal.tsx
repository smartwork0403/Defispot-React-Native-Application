import React from 'react';
import {View, StyleSheet, Pressable, Image} from 'react-native';
import {colors} from '../styles';

import CustomText from './CustomText';
import Modal from './Modal';
import TextField from './TextField';

import MagnifySvg from '../assets/icons/magnify.svg';
import CheckSvg from '../assets/icons/check.svg';

interface Item {
  icon?: any;
  title: string;
  info?: string;
  append?: string;
  value: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  infoPosition?: 'left';
  searchPlaceholder?: string;
  items: Item[];
  selected: string;
  onChange: (value: string) => void;
}

const ListPickerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  infoPosition,
  searchPlaceholder,
  items,
  selected,
  onChange,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      noHandle
      noPadding
      fullHeight
      stickyAction={{
        label: 'Select',
        onPress: onClose,
      }}
      header={{
        title,
      }}>
      <View style={styles.inputContainer}>
        <TextField
          prependIcon={{icon: MagnifySvg}}
          accent="grey"
          placeholder={searchPlaceholder ?? 'Search...'}
        />
      </View>

      <View>
        {items.map(item => (
          <Pressable
            onPress={() => onChange(item.value)}
            style={[
              styles.item,
              {
                backgroundColor:
                  item.value === selected ? colors.neutral50 : 'transparent',
              },
            ]}
            key={item.value}>
            {item.icon && (
              <Image
                source={item.icon}
                style={[styles.itemImage, {marginRight: item.append ? 12 : 16}]}
              />
            )}
            <CustomText
              weight="medium"
              style={[
                styles.itemText,
                {flexGrow: infoPosition === 'left' ? 0 : 1},
              ]}>
              {item.title}
            </CustomText>
            {item.info && (
              <CustomText
                weight="medium"
                style={[
                  styles.itemInfo,
                  {flexGrow: infoPosition === 'left' ? 1 : 0},
                ]}>
                {item.info}
              </CustomText>
            )}
            {item.append && (
              <CustomText style={[styles.itemAppend]}>{item.append}</CustomText>
            )}
            {item.value === selected && (
              <View style={styles.itemCheckContainer}>
                <CheckSvg height={9} width={11} color={colors.blue} />
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    paddingTop: 14,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 12,
  },
  item: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 8,
  },
  itemImage: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
  },
  itemText: {
    paddingRight: 4,
  },
  itemInfo: {
    marginRight: 12,
    color: colors.neutral500,
  },
  itemAppend: {
    marginRight: 12,
  },
  itemCheckContainer: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListPickerModal;
