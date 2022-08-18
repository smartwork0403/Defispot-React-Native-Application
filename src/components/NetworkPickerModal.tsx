import React from 'react';

import ListPickerModal from './ListPickerModal';

export const items = [
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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selected: string;
  onChange: (value: string) => void;
}

const NetworkPickerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selected,
  onChange,
}) => {
  return (
    <ListPickerModal
      title="Select network"
      searchPlaceholder="Search..."
      isOpen={isOpen}
      onClose={onClose}
      items={items}
      selected={selected}
      onChange={value => onChange(value)}
      infoPosition="left"
    />
  );
};

export default NetworkPickerModal;
