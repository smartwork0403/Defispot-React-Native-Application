import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Button from './Button';
import CustomText from './CustomText';
import Modal from './Modal';

import CheckSvg from '../assets/icons/check.svg';
import ChevronDownSvg from '../assets/icons/chevron-down.svg';

type Item = {name: string; label: string; icon: any};

interface Props {
  label: string;
  accent?: 'black' | 'blue';
  size?: 'small' | 'tiny';
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
  size,
  accent,
  items,
  selected,
  onSelect,
  header,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewSelected, setPreviewSelected] = useState(selected);

  useEffect(() => {
    setPreviewSelected(selected);
  }, [isOpen, selected]);

  return (
    <View>
      <Button onPress={() => setIsOpen(true)} size={size} accent={accent}>
        <View style={styles.btn}>
          <CustomText style={styles.btnText}>{label}</CustomText>
          <View style={styles.btnIcon}>
            <ChevronDownSvg width={10} color="#121315" />
          </View>
        </View>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        noPadding
        stickyAction
        actionLabel="Apply"
        onActionPress={() => {
          onSelect(previewSelected);
          setIsOpen(false);
        }}>
        {header && (
          <View style={styles.header}>
            <CustomText style={styles.headerTitle}>{header.title}</CustomText>
            <Button
              onPress={header.onHeaderActionPress}
              text
              noPadding
              textAccent="blue">
              {header.actionLabel}
            </Button>
          </View>
        )}

        <View style={styles.list}>
          {items.map(item => (
            <Pressable
              onPress={() => setPreviewSelected(item.name)}
              style={{
                ...styles.item,
                backgroundColor:
                  previewSelected === item.name ? '#F7F8FA' : '#fff',
              }}
              key={item.name}>
              {item.icon && (
                <View style={styles.itemIcon}>
                  <item.icon width={12} height={12} color="#A1A1A8" />
                </View>
              )}

              <CustomText style={styles.itemText}>{item.label}</CustomText>

              {previewSelected === item.name && (
                <View style={styles.itemIcon}>
                  <CheckSvg width={12} height={12} color="#0077FF" />
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnText: {
    fontFamily: 'Inter-Medium',
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
    paddingTop: 2,
    paddingBottom: 16,
    paddingRight: 24,
    paddingLeft: 24,
    borderBottomColor: '#EFF0F3',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginRight: 16,
  },
  list: {
    paddingTop: 12,
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 24,
    paddingRight: 24,
  },
  itemIcon: {
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemText: {
    fontFamily: 'Inter-Medium',
    marginRight: 'auto',
  },
});

export default Select;
