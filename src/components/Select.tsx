import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';

import {colors} from '../styles';

import CustomText from './CustomText';
import ListPickerModal from './ListPickerModal';

import ChevronDownSVG from '../assets/icons/chevron-down.svg';
import NetworkPickerModal from './NetworkPickerModal';
import AssetPickerModal from './AssetPickerModal';

import {items as networkItems} from './NetworkPickerModal';
import {items as assetItems} from './AssetPickerModal';

interface Item {
  icon?: any;
  title: string;
  info?: string;
  append?: string;
  value: string;
}

interface Props {
  items?: Item[];
  title?: string;
  searchPlaceholder?: string;
  placeholder?: string;
  label?: string;
  selected: string | null;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  type?: 'asset' | 'network';
}

const Select: React.FC<Props> = ({
  items = [],
  title,
  searchPlaceholder,
  placeholder,
  label,
  selected,
  onChange,
  style,
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  let selectedItem: Item | null = null;

  const findSelectedItem = list => {
    return list.find(item => item.value === selected) ?? null;
  };

  if (type === 'network') {
    selectedItem = findSelectedItem(networkItems);
  } else if (type === 'asset') {
    selectedItem = findSelectedItem(assetItems);
  } else {
    selectedItem = findSelectedItem(items);
  }

  const getTargetPickerModal = () => {
    if (type === 'network') {
      return (
        <NetworkPickerModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          selected={selected ?? ''}
          onChange={value => onChange(value)}
        />
      );
    }

    if (type === 'asset') {
      return (
        <AssetPickerModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          selected={selected ?? ''}
          onChange={value => onChange(value)}
        />
      );
    }

    return (
      <ListPickerModal
        title={title ?? 'Select'}
        searchPlaceholder={searchPlaceholder}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        selected={selected ?? ''}
        onChange={value => onChange(value)}
        infoPosition="left"
      />
    );
  };

  return (
    <View style={style}>
      {label && (
        <CustomText weight="medium" style={styles.label}>
          {label}
        </CustomText>
      )}

      <Pressable
        onPress={() => setIsOpen(true)}
        style={[
          styles.select,
          {
            paddingLeft: selectedItem?.icon ? 10 : 16,
          },
        ]}>
        <View style={styles.value}>
          {selectedItem ? (
            <>
              {selectedItem.icon && (
                <Image source={selectedItem.icon} style={styles.icon} />
              )}
              <CustomText weight="medium">{selectedItem.title}</CustomText>
              {selectedItem.info && (
                <CustomText style={styles.placeholder}>
                  {' '}
                  - {selectedItem.info}
                </CustomText>
              )}
            </>
          ) : (
            <CustomText style={styles.placeholder}>
              {placeholder ?? 'Select an option'}
            </CustomText>
          )}
        </View>

        <View style={styles.dropdown}>
          <ChevronDownSVG height={5} width={8} color={colors.neutral400} />
        </View>
      </Pressable>

      {getTargetPickerModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
  },
  select: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.neutral200,
    backgroundColor: colors.neutral0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholder: {
    color: colors.neutral500,
  },
  dropdown: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 24,
    width: 24,
    borderRadius: 24 / 2,
    marginRight: 8,
  },
});

export default Select;
