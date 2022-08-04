import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {colors} from '../styles';

import Layout from '../components/Layout';
import CustomText from '../components/CustomText';

import SettingsSvg from '../assets/icons/settings.svg';
import ArrowUpRightSvg from '../assets/icons/arrow-up-right.svg';
import SwapSvg from '../assets/icons/swap.svg';
import CheckCircleSvg from '../assets/icons/check-circle.svg';
import InformationCircleSvg from '../assets/icons/information-circle.svg';
import InformationReverseCircleSvg from '../assets/icons/information-reverse-circle.svg';

const Notification: React.FC<{
  type: 'send' | 'exchange' | 'success' | 'error' | 'info';
  title: string;
  time: string;
  message: string;
}> = ({type, title, time, message}) => {
  return (
    <View style={styles.notification}>
      {type === 'send' || type === 'exchange' ? (
        <View style={styles.iconContainer}>
          <View style={styles.iconType}>
            {type === 'send' ? (
              <ArrowUpRightSvg
                width={14}
                height={14}
                color={colors.neutral300}
              />
            ) : type === 'exchange' ? (
              <SwapSvg width={20} height={20} color={colors.neutral300} />
            ) : null}
          </View>

          <View style={styles.iconCoinContainer}>
            <Image
              source={require('../assets/images/sample.png')}
              style={{height: 18, width: 18, borderRadius: 18 / 2}}
            />
          </View>
        </View>
      ) : null}

      {type === 'success' && (
        <View style={styles.iconInfoContainer}>
          <CheckCircleSvg height={20} width={20} color={colors.green} />
        </View>
      )}
      {type === 'error' && (
        <View style={styles.iconInfoContainer}>
          <InformationCircleSvg height={20} width={20} color={colors.red} />
        </View>
      )}
      {type === 'info' && (
        <View style={styles.iconInfoContainer}>
          <InformationReverseCircleSvg
            height={20}
            width={20}
            color={colors.blue}
          />
        </View>
      )}

      <View style={{flex: 1}}>
        <View style={styles.header}>
          <CustomText weight="medium" style={styles.headerTitle}>
            {title}
          </CustomText>
          <CustomText weight="medium" style={styles.headerTime}>
            {time}
          </CustomText>
        </View>
        <CustomText style={styles.message}>{message}</CustomText>
      </View>
    </View>
  );
};

const NotificationsScreen: React.FC = () => {
  return (
    <Layout
      header={{
        title: 'Notifications',
        minimal: true,
        action: {type: 'icon', icon: SettingsSvg},
        back: true,
      }}
      contentStyle={{paddingBottom: 4}}>
      <View>
        <Notification
          type="send"
          title="Send"
          time="10 min ago"
          message="1.30 ETH sent to 0x36246976 🤝"
        />
        <Notification
          type="exchange"
          title="Exchange"
          time="1 day ago"
          message="1.30 ETH  exchanged to 0.2 BTC 🤝"
        />
        <Notification
          type="success"
          title="Successful"
          time="1 day ago"
          message="This action has been successful."
        />
        <Notification
          type="error"
          title="Swap "
          time="1 day ago"
          message="This action could not be executed."
        />
        <Notification
          type="info"
          title="Update "
          time="2 days ago"
          message="This action could not be executed."
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  notification: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    borderRadius: 8,
    borderColor: colors.neutral100,
    borderWidth: 1,
    marginBottom: 12,
    backgroundColor: colors.neutral0,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    flexShrink: 0,
  },
  iconType: {
    borderColor: colors.neutral200,
    borderWidth: 1,
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCoinContainer: {
    height: 20,
    width: 20,
    borderRadius: 20 / 2,
    backgroundColor: colors.neutral0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -4,
    bottom: -4,
  },
  iconInfoContainer: {
    height: 32,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginRight: 4,
  },
  headerTime: {
    color: colors.neutral400,
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 'auto',
  },
  message: {
    color: colors.neutral600,
  },
});

export default NotificationsScreen;
