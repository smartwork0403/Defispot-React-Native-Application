import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import type {Props as ButtonProps} from './Button';

import {colors} from '../styles';

import Button from './Button';
import CustomText from './CustomText';
import Modal from './Modal';

import CheckSvg from '../assets/icons/check.svg';
import ChevronDownSvg from '../assets/icons/chevron-down.svg';

type Item = {name: string; label: string; icon?: any};

interface Props extends ButtonProps {
  label: string;
  items: Item[];
  selected: string;
  onSelect: (name: string) => void;
  header?: {
    title: string;
    actionLabel: string;
    onHeaderActionPress: () => void;
  };
}

const Select: React.FC<Props> = ({
  label,
  items,
  selected,
  onSelect,
  header,
  ...btnProps
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewSelected, setPreviewSelected] = useState(selected);

  useEffect(() => {
    setPreviewSelected(selected);
  }, [isOpen, selected]);

  return (
    <View>
      <Button onPress={() => setIsOpen(true)} {...btnProps}>
        <View style={styles.btn}>
          <CustomText weight="medium">{label}</CustomText>
          <View style={styles.btnIcon}>
            <ChevronDownSvg
              width={10}
              color={isOpen ? colors.blue : colors.neutral900}
              style={{transform: [{rotate: isOpen ? '180deg' : '0deg'}]}}
            />
          </View>
        </View>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        noPadding
        stickyAction={{
          label: 'Apply',
          onPress: () => {
            onSelect(previewSelected);
            setIsOpen(false);
          },
        }}>
        {header && (
          <View style={styles.header}>
            <CustomText weight="medium" style={styles.headerTitle}>
              {header.title}
            </CustomText>
            <Button onPress={header.onHeaderActionPress} text>
              {header.actionLabel}
            </Button>
          </View>
        )}

        {items.map(item => (
          <Pressable
            onPress={() => setPreviewSelected(item.name)}
            style={{
              ...styles.item,
              backgroundColor:
                previewSelected === item.name
                  ? colors.neutral50
                  : colors.neutral0,
            }}
            key={item.name}>
            {item.icon && (
              <View style={styles.itemIcon}>
                <item.icon width={12} height={12} color={colors.neutral400} />
              </View>
            )}

            <CustomText weight="medium" style={styles.itemText}>
              {item.label}
            </CustomText>

            {previewSelected === item.name && (
              <View style={styles.itemIcon}>
                <CheckSvg width={12} height={12} color={colors.blue} />
              </View>
            )}
          </Pressable>
        ))}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnIcon: {
    height: 20,
    width: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: colors.neutral100,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    marginRight: 16,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
  },
  itemIcon: {
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemText: {
    marginRight: 'auto',
  },
});

export default Select;
