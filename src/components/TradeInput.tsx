import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  StyleProp,
  ViewStyle,
} from 'react-native';

import {colors, fonts} from '../styles';

import CustomText from './CustomText';
import NetworkPickerModal from './NetworkPickerModal';

import {items as networkItems} from './NetworkPickerModal';
import {items as assetItems} from './AssetPickerModal';

import ChevronDownSvg from '../assets/icons/chevron-down.svg';
import AssetPickerModal from './AssetPickerModal';

const FOCUS_STATE = {
  idle: 'idle',
  focused: 'focused',
  error: 'error',
};

interface Props {
  style?: StyleProp<ViewStyle>;
}

const TradeInput: React.FC<Props> = ({style}) => {
  const [focusState, setFocusState] = useState(FOCUS_STATE.idle);

  const [isNetworkPickerModalOpen, setIsNetworkPickerModalOpen] =
    useState(false);
  const [isAssetPickerModalOpen, setIsAssetPickerModalOpen] = useState(false);

  const [selectedNetwork, setSelectedNetwork] = useState<string | null>('avax');
  const [selectedAsset, setSelectedAsset] = useState<string | null>('link');

  const selectedNetworkItem =
    networkItems.find(item => item.value === selectedNetwork) ?? null;
  const selectedAssetItem =
    assetItems.find(item => item.value === selectedAsset) ?? null;

  const getBorderColor = () => {
    if (focusState === FOCUS_STATE.focused) {
      return colors.blue;
    } else if (focusState === FOCUS_STATE.error) {
      return colors.red;
    }

    return colors.neutral200;
  };

  return (
    <View style={style}>
      <Pressable
        style={styles.networkPicker}
        onPress={() => setIsNetworkPickerModalOpen(true)}>
        <Image
          source={require('../assets/images/sample.png')}
          style={styles.networkPickerIcon}
        />
        <CustomText weight="medium" style={styles.networkPickerText}>
          {selectedNetworkItem?.title}
        </CustomText>
        <View style={styles.networkPickerDropdown}>
          <ChevronDownSvg width={7} color={colors.neutral400} />
        </View>
      </Pressable>

      <View style={[styles.container, {borderColor: getBorderColor()}]}>
        <View style={styles.top}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onFocus={() => setFocusState(FOCUS_STATE.focused)}
              onBlur={() => setFocusState(FOCUS_STATE.idle)}
              placeholder="0.00"
              placeholderTextColor={colors.neutral300}
              keyboardType="number-pad"
            />
            <CustomText style={styles.price}>$0.00</CustomText>
          </View>

          <Pressable
            style={styles.assetPicker}
            onPress={() => setIsAssetPickerModalOpen(true)}>
            <Image
              source={selectedAssetItem?.icon}
              style={styles.assetPickerIcon}
            />
            <CustomText weight="medium">{selectedAssetItem?.title}</CustomText>
            <View style={styles.assetPickerDropdown}>
              <ChevronDownSvg width={10} color={colors.neutral400} />
            </View>
          </Pressable>
        </View>

        <View style={styles.bottom}>
          <CustomText weight="medium" style={styles.bottomTextTitle}>
            Balance:{' '}
          </CustomText>
          <CustomText weight="medium" style={styles.bottomTextValue}>
            256
          </CustomText>
        </View>
      </View>

      <NetworkPickerModal
        isOpen={isNetworkPickerModalOpen}
        onClose={() => setIsNetworkPickerModalOpen(false)}
        selected={selectedNetwork ?? ''}
        onChange={value => setSelectedNetwork(value)}
      />

      <AssetPickerModal
        isOpen={isAssetPickerModalOpen}
        onClose={() => setIsAssetPickerModalOpen(false)}
        selected={selectedAsset ?? ''}
        onChange={value => setSelectedAsset(value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  networkPicker: {
    padding: 4,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 24,
    marginBottom: 12,
    minWidth: 156,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.neutral0,
  },
  networkPickerIcon: {
    height: 24,
    width: 24,
    marginRight: 8,
    borderRadius: 100,
  },
  networkPickerText: {
    paddingRight: 8,
    flexGrow: 1,
  },
  networkPickerDropdown: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: colors.neutral0,
  },
  top: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: colors.neutral100,
    borderBottomWidth: 1,
  },
  inputContainer: {
    marginRight: 24,
    flex: 1,
  },
  input: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: fonts.interSemiBold,
    color: colors.neutral900,
  },
  price: {
    color: colors.neutral400,
  },
  assetPicker: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 8,
    borderRadius: 24,
    backgroundColor: colors.neutral100,
    flexDirection: 'row',
  },
  assetPickerIcon: {
    height: 20,
    width: 20,
    marginRight: 8,
    borderRadius: 20 / 2,
  },
  assetPickerDropdown: {
    height: 24,
    width: 24,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
  },
  bottomTextTitle: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.neutral500,
  },
  bottomTextValue: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.blue,
  },
});

export default TradeInput;
