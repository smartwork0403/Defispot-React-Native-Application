import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, globalStyles} from '../styles';

import IconButton from './IconButton';

import NavBackSvg from '../assets/icons/nav-back.svg';
import Asset from './Asset';
import CustomText from './CustomText';
import {formatFloat} from '../helpers/NumberUtil';

interface Props {
  image: string;
  name: string;
  chain: string;
  price: number;
  percent: number;
}

const AssetHeader: React.FC<Props> = ({image, name, chain, price, percent}) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        backgroundColor: colors.neutral0,
        borderBottomColor: colors.neutral100,
        borderBottomWidth: 1,
      }}>
      <View style={{...styles.header, ...globalStyles.wrapper}}>
        <IconButton
          icon={NavBackSvg}
          iconSize={{width: 9, height: 16}}
          color={colors.neutral400}
          onPress={() => navigation.goBack()}
          style={{marginRight: 12}}
        />
        <Asset image={image} name={name} value={chain} size="medium" />
        <View style={styles.info}>
          <CustomText weight="medium" style={styles.infoValue}>
            ${formatFloat(price, 2)}
          </CustomText>
          <CustomText
            weight="medium"
            style={[
              styles.infoPercent,
              {
                color: percent.toString().includes('-')
                  ? colors.red
                  : colors.green,
              },
            ]}>
            {percent.toFixed(2)}%
          </CustomText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 16,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    paddingLeft: 12,
    marginLeft: 'auto',
    justifyContent: 'flex-end',
  },
  infoValue: {
    textAlign: 'right',
  },
  infoPercent: {
    textAlign: 'right',
    fontSize: 12,
    lineHeight: 16,
  },
});

export default AssetHeader;
