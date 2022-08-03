import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Share from 'react-native-share';
import {colors} from '../styles';

import Modal from './Modal';
import CustomText from './CustomText';
import IconButton from './IconButton';

import ShareLinkSvg from '../assets/icons/share-link.svg';
import FlowerShapeSvg from '../assets/icons/flower-shape.svg';
import CopySvg from '../assets/icons/copy.svg';

import BTCLogoSvg from '../assets/crypto-logos/btc.svg';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const items = [
  {
    title: 'Transactions Fee',
    value: '0.000728967162687456 ETH',
  },
  {
    title: 'Gas Limit',
    value: '0.000728967162687456 ETH',
  },
  {
    title: 'Gas Price',
    value: '2.97878049488e-8 LINK',
  },
  {
    title: 'Nonce',
    value: '1',
  },
  {
    title: 'Block Number',
    value: '14486951',
  },
];

const TransactionDetails: React.FC<Props> = ({isOpen, onClose}) => {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const handleCopyFromTo = (address: string) => {
    Clipboard.setString(address);
    setShowCopiedMessage(true);

    setTimeout(() => {
      setShowCopiedMessage(false);
    }, 3000);
  };

  const handleShare = async () => {
    try {
      const res = await Share.open({
        title: 'Transaction Details',
        message: 'Shareable content will go here.',
      });
      console.log(res);
    } catch (err) {
      err && console.log(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      noPadding
      header={{title: 'Transaction Details'}}
      noHandle
      fullHeight
      stickyAction={{
        label: 'Share',
        outlined: true,
        prependIcon: {icon: ShareLinkSvg},
        onPress: handleShare,
      }}>
      <View style={styles.container}>
        <View style={styles.item}>
          <CustomText
            weight="medium"
            style={{...styles.itemTitle, marginBottom: 8}}>
            From/To
          </CustomText>

          {!showCopiedMessage ? (
            <View style={styles.itemFromTo}>
              <View style={styles.itemFromToIconContainer}>
                <FlowerShapeSvg
                  height={16}
                  width={16}
                  color={colors.greenDark}
                />
              </View>

              <CustomText weight="medium" style={styles.itemFromToValue}>
                55d898...93842fb
              </CustomText>

              <IconButton
                icon={CopySvg}
                size="small"
                color={colors.neutral400}
                iconSize={{width: 16, height: 16}}
                onPress={() => handleCopyFromTo('55d898...93842fb')}
              />
            </View>
          ) : (
            <View style={styles.copied}>
              <CustomText weight="medium" style={styles.copiedText}>
                Copied
              </CustomText>
            </View>
          )}
        </View>

        {items.map(item => (
          <View style={styles.item} key={item.title}>
            <CustomText weight="medium" style={styles.itemTitle}>
              {item.title}
            </CustomText>
            <CustomText>{item.value}</CustomText>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.horizontalItem}>
          <CustomText
            weight="medium"
            style={{...styles.itemTitle, marginRight: 'auto'}}>
            Sent
          </CustomText>
          <BTCLogoSvg height={20} width={20} />
          <CustomText weight="medium" style={styles.horizontalItemValue}>
            0.0010 ETH
          </CustomText>
        </View>

        <View style={styles.horizontalItem}>
          <CustomText
            weight="medium"
            style={{...styles.itemTitle, marginRight: 'auto'}}>
            Date
          </CustomText>
          <CustomText weight="medium" style={styles.horizontalItemValue}>
            30 Mar 2022, 12:01
          </CustomText>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingRight: 16,
    paddingLeft: 16,
  },
  item: {
    marginBottom: 16,
  },
  itemTitle: {
    color: colors.neutral500,
  },
  itemFromTo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemFromToIconContainer: {
    height: 32,
    width: 32,
    borderRadius: 32 / 2,
    backgroundColor: colors.greenLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  itemFromToValue: {
    marginRight: 'auto',
    paddingRight: 8,
  },
  copied: {
    borderRadius: 24,
    backgroundColor: colors.blueLight,
    alignItems: 'center',
    textAlign: 'center',
  },
  copiedText: {
    color: colors.blueDark,
    padding: 4,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: colors.neutral100,
    marginTop: 8,
    marginBottom: 24,
  },
  horizontalItem: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalItemValue: {
    marginLeft: 4,
  },
});

export default TransactionDetails;
