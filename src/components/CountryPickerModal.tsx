import React, {useState} from 'react';

import ListPickerModal from './ListPickerModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CountryPickerModal: React.FC<Props> = ({isOpen, onClose}) => {
  const [selected, setSelected] = useState('germany');

  const items = [
    {
      icon: require('../assets/images/sample.png'),
      title: 'USA',
      value: 'usa',
    },
    {
      icon: require('../assets/images/sample.png'),
      title: 'Germany',
      value: 'germany',
    },
    {
      icon: require('../assets/images/sample.png'),
      title: 'Turkey',
      value: 'turkey',
    },
  ];

  return (
    <ListPickerModal
      title="Country"
      searchPlaceholder="Search..."
      isOpen={isOpen}
      onClose={onClose}
      items={items}
      selected={selected}
      onChange={value => setSelected(value)}
    />
  );
};

export default CountryPickerModal;
