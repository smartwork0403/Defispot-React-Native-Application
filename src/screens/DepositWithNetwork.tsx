import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';

import {colors} from '../styles';

import Layout from '../components/Layout';
import CustomText from '../components/CustomText';
import Card from '../components/Card';
import Button from '../components/Button';
import NetworkPickerModal from '../components/NetworkPickerModal';
import {items as networkItems} from './NetworkPickerModal';

import SampleQrCodeSvg from '../assets/icons/sample-qr-code.svg';
import CopySvg from '../assets/icons/copy.svg';
import SwapSvg from '../assets/icons/swap.svg';
import CloseSvg from '../assets/icons/close.svg';
import DownloadSvg from '../assets/icons/download.svg';
import ShareLinkSvg from '../assets/icons/share-link.svg';

const CardItem: React.FC<{
  title: string;
  value: string;
  valueAccent?: 'blue' | 'black';
  icon?: any;
  onActionPress?: () => void;
}> = ({title, value, valueAccent, icon: Icon, onActionPress}) => (
  <View>
    <CustomText weight="medium" style={styles.cardTitle}>
      {title}
    </CustomText>
    <View style={styles.cardValue}>
      {valueAccent === 'blue' ? (
        <CustomText
          weight="medium"
          style={{
            flexGrow: 1,
            color: colors.blue,
          }}>
          {value}
        </CustomText>
      ) : (
        <CustomText
          style={{
            flexGrow: 1,
          }}>
          {value}
        </CustomText>
      )}
      {Icon && (
        <Pressable style={styles.cardAction} onPress={onActionPress}>
          <Icon height={13} width={13} color={colors.neutral400} />
        </Pressable>
      )}
    </View>
  </View>
);

const DepositWithNetwork: React.FC = () => {
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [isNetworkPickerModalOpen, setIsNetworkPickerModal] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('');

  return (
    <Layout
      stickyHeader
      contentStyle={{paddingTop: 24, paddingBottom: 16}}
      header={{minimal: {title: 'Deposit with network', back: true}}}
      footer={
        <View style={styles.footer}>
          <Button
            size="large"
            prependIcon={{icon: DownloadSvg}}
            style={{flexGrow: 1, marginRight: 8}}
            accent="white"
            outlined>
            Save as image
          </Button>
          <Button
            size="large"
            prependIcon={{icon: ShareLinkSvg}}
            style={{flexGrow: 1, marginLeft: 8}}>
            Share Address
          </Button>
        </View>
      }>
      <View style={styles.qrCodeContainer}>
        <SampleQrCodeSvg height={176} width={176} />
      </View>
      <CustomText weight="medium" style={styles.info}>
        Transfer your digital assets to the displayed address or scan the QR
        code above, and they will be deposited into your account.
      </CustomText>

      <Card style={styles.card}>
        <CardItem
          title="ETH Deposit Address"
          value={
            isAddressCopied
              ? 'Copied to clipboard'
              : '2MxdyKzqM3442GWD8ZtmCMBDugrLa22'
          }
          valueAccent={isAddressCopied ? 'blue' : 'black'}
          icon={isAddressCopied ? CloseSvg : CopySvg}
          onActionPress={() => {
            setIsAddressCopied(true);

            setTimeout(() => {
              setIsAddressCopied(false);
            }, 2000);
          }}
        />
        <View style={styles.cardDivider} />
        <CardItem
          title="Network"
          value="Etherum (ERC20)"
          icon={SwapSvg}
          onActionPress={() => setIsNetworkPickerModal(true)}
        />
        <View style={styles.cardDivider} />
        <CardItem title="Selected Wallet" value="Spot Wallet" />
      </Card>

      <View style={styles.detail}>
        <CustomText style={styles.detailText}>Minimum deposit</CustomText>
        <CustomText weight="medium">0.00000000</CustomText>
      </View>
      <View style={styles.detail}>
        <CustomText style={styles.detailText}>Expected arrival</CustomText>
        <CustomText weight="medium">12 network confirmations</CustomText>
      </View>

      <NetworkPickerModal
        isOpen={isNetworkPickerModalOpen}
        onClose={() => setIsNetworkPickerModal(false)}
        selected={selectedNetwork ?? ''}
        onChange={value => setSelectedNetwork(value)}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  qrCodeContainer: {
    padding: 12,
    marginBottom: 24,
    backgroundColor: colors.neutral0,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  info: {
    marginBottom: 12,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    color: colors.neutral400,
  },
  card: {
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 24,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  cardTitle: {
    color: colors.neutral500,
  },
  cardValue: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  cardAction: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    marginLeft: 12,
  },
  cardDivider: {
    height: 1,
    width: '100%',
    backgroundColor: colors.neutral100,
    marginTop: 16,
    marginBottom: 16,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    flexGrow: 1,
    color: colors.neutral500,
  },
  footer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 12,
    paddingLeft: 12,
    backgroundColor: colors.neutral0,
  },
});

export default DepositWithNetwork;
