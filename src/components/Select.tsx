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

interface Item {
  icon?: any;
  title: string;
  info?: string;
  append?: string;
  value: string;
}

interface Props {
  items: Item[];
  title: string;
  searchPlaceholder: string;
  placeholder?: string;
  label?: string;
  selected: string | null;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

const Select: React.FC<Props> = ({
  items,
  title,
  searchPlaceholder,
  placeholder,
  label,
  selected,
  onChange,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = items.find(item => item.value === selected);

  return (
    <View style={style}>
      <CustomText weight="medium">{label}</CustomText>
      <Pressable
        onPress={() => setIsOpen(true)}
        style={[
          styles.select,
          {
            paddingLeft: selectedItem ? 10 : 16,
          },
        ]}>
        <View style={styles.value}>
          {selectedItem ? (
            <>
              <Image source={selectedItem.icon} style={styles.icon} />
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

      <ListPickerModal
        title={title}
        searchPlaceholder={searchPlaceholder}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        selected={selected ?? ''}
        onChange={value => onChange(value)}
        infoPosition="left"
      />
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
