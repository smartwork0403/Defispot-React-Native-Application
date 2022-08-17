import React, {useState} from 'react';

import ListPickerModal from './ListPickerModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NetworkPickerModal: React.FC<Props> = ({isOpen, onClose}) => {
  const [selected, setSelected] = useState('eth');

  const items = [
    {
      title: 'BTC',
      info: 'Ethereum (ERC20)',
      value: 'BTC',
    },
    {
      title: 'ETH',
      info: 'Ethereum (ERC20)',
      value: 'eth',
    },
    {
      title: 'AVAX',
      info: 'Ethereum (ERC20)',
      value: 'avax',
    },
  ];

  return (
    <ListPickerModal
      title="Select network"
      searchPlaceholder="Search..."
      isOpen={isOpen}
      onClose={onClose}
      items={items}
      selected={selected}
      onChange={value => setSelected(value)}
      infoPosition="left"
    />
  );
};

export default NetworkPickerModal;
