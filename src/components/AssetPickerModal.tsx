import React from 'react';

import ListPickerModal from './ListPickerModal';

export const items = [
  {
    icon: require('../assets/images/sample.png'),
    title: 'BTC',
    info: 'Bitcoin',
    append: '$12,400.00',
    value: 'btc',
  },
  {
    icon: require('../assets/images/sample.png'),
    title: 'LINK',
    info: 'Chainlink',
    append: '$2,324.00',
    value: 'link',
  },
  {
    icon: require('../assets/images/sample.png'),
    title: 'BCH',
    info: 'Bitcoin Cash',
    append: '$0.00',
    value: 'bch',
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selected: string;
  onChange: (value: string) => void;
}

const AssetPickerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selected,
  onChange,
}) => {
  return (
    <ListPickerModal
      title="Select a token"
      searchPlaceholder="Search all assets"
      isOpen={isOpen}
      onClose={onClose}
      items={items}
      selected={selected}
      onChange={value => onChange(value)}
      infoPosition="left"
    />
  );
};

export default AssetPickerModal;
