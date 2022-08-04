import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, globalStyles} from '../styles';

import IconButton from './IconButton';

import NavBackSvg from '../assets/icons/nav-back.svg';
import Asset from './Asset';
import CustomText from './CustomText';

const AssetHeader: React.FC = () => {
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
        <Asset name="LINK" value="Chainlink" size="medium" />
        <View style={styles.info}>
          <CustomText weight="medium" style={styles.infoValue}>
            $3,352.00
          </CustomText>
          <CustomText weight="medium" style={styles.infoPercent}>
            12.54%
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
    color: colors.green,
  },
});

export default AssetHeader;
