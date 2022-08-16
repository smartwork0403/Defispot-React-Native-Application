import React, {useState} from 'react';

import ListPickerModal from './ListPickerModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NativeCurrencyPickerModal: React.FC<Props> = ({isOpen, onClose}) => {
  const [selected, setSelected] = useState('usd');

  const items = [
    {
      title: 'TRY',
      info: 'Turkish Lira',
      value: 'try',
    },
    {
      title: 'EUR',
      info: 'Euro',
      value: 'eur',
    },
    {
      title: 'USD',
      info: 'United States Dollars',
      value: 'usd',
    },
    {
      title: 'AED',
      info: 'United Arab Emirates Dirham',
      value: 'aed',
    },
    {
      title: 'AZN',
      info: 'Azerbaijani Manat',
      value: 'azn',
    },
  ];

  return (
    <ListPickerModal
      title="Native currency"
      searchPlaceholder="Search all currencies"
      isOpen={isOpen}
      onClose={onClose}
      items={items}
      selected={selected}
      onChange={value => setSelected(value)}
    />
  );
};

export default NativeCurrencyPickerModal;
