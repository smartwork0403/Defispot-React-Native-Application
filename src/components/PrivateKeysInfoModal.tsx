import React from 'react';
import {colors} from '../styles';

import CustomText from './CustomText';
import Modal from './Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PrivateKeysInfoModal: React.FC<Props> = ({isOpen, onClose}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      stickyAction={{
        label: 'Cancel',
        onPress: onClose,
        accent: 'white',
        outlined: true,
      }}
      header={{
        title: 'Do NOT use your private keys',
        style: 'no-close',
      }}>
      <CustomText style={{marginBottom: 30}}>
        unless you fully understand DefiSpot’s on-chain protocol. You may lose
        funds by taking improper actions. Importantly:
      </CustomText>
      <CustomText>
        {`\u2022`} DefiSpot stores your funds as aaUST, not UST or aUST.
      </CustomText>
      <CustomText>
        {`\u2022`} If you send UST or aUST to your wallet, it will not show up
        in the app.
      </CustomText>
      <CustomText style={{marginBottom: 30}}>
        {`\u2022`} To access your funds, you’ll need to send contract calls to
        the aaUST smart contract.
      </CustomText>
      <CustomText style={{marginBottom: 12}}>
        For more informations on DefiSpot’s on-chain protocol, visit{' '}
        <CustomText
          weight="medium"
          style={{color: colors.blue}}
          onPress={() => {}}>
          app.defispot.com
        </CustomText>
      </CustomText>
    </Modal>
  );
};

export default PrivateKeysInfoModal;
