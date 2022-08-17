import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import {colors} from '../styles';

import Layout from '../components/Layout';
import Notification from '../components/Notification';
import type {RootStackParamList} from 'components/Navigation';
import Card from '../components/Card';
import CustomText from '../components/CustomText';
import Button from '../components/Button';

import SettingsSvg from '../assets/icons/settings.svg';
import LoadingSvg from '../assets/icons/loading.svg';
import LinkSvg from '../assets/icons/link.svg';

const History: React.FC = () => {
  return (
    <View>
      <Card style={historyStyles.header}>
        <View style={historyStyles.headerIconContainer}>
          <LoadingSvg height={18} width={18} />
        </View>

        <CustomText weight="medium">
          Swap 10 UST for 1.60937 THORChain
        </CustomText>
      </Card>
      <Card style={historyStyles.content}>
        <View style={historyStyles.item}>
          <View style={historyStyles.itemProgressContainer}>
            <View
              style={[
                historyStyles.itemProgressLineBefore,
                {backgroundColor: 'transparent'},
              ]}
            />
            <View style={historyStyles.itemProgressBullet} />
            <View style={historyStyles.itemProgressLineAfter} />
          </View>

          <CustomText style={historyStyles.itemText}>Send 10 UST</CustomText>

          <Pressable style={historyStyles.itemActionContainer}>
            <LinkSvg height={14} width={14} color={colors.neutral300} />
          </Pressable>
        </View>

        <View style={historyStyles.item}>
          <View style={historyStyles.itemProgressContainer}>
            <View
              style={[
                historyStyles.itemProgressLineBefore,
                {backgroundColor: colors.neutral300},
              ]}
            />
            <View
              style={[
                historyStyles.itemProgressBullet,
                {backgroundColor: colors.neutral300},
              ]}
            />
            <View
              style={[
                historyStyles.itemProgressLineAfter,
                {backgroundColor: 'transparent'},
              ]}
            />
          </View>

          <CustomText style={historyStyles.itemText}>
            Receive 1.60937 THORChain
          </CustomText>
        </View>

        <View style={historyStyles.footer}>
          <Button
            size="small"
            accent="red"
            outlined
            style={{marginRight: 8, flexGrow: 1}}>
            Clear History
          </Button>
          <Button
            size="small"
            accent="white"
            outlined
            style={{marginLeft: 8, flexGrow: 1}}>
            Less Detail
          </Button>
        </View>
      </Card>
    </View>
  );
};

const Notifications: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Layout
      accent="white"
      header={{
        title: 'Notifications',
        minimal: {
          title: 'Notifications',
          back: true,
          action: {
            icon: SettingsSvg,
            onActionPress: () => navigation.navigate('NotificationsSettings'),
          },
        },
      }}>
      <View>
        <Notification
          title="Price Alert"
          time="2 min ago"
          message="📊  Bitcoin (BTC) is down 5.98% 
          to SGD41,433,58 in the last 24 hours."
          style={styles.notification}
        />
        <Notification
          type="send"
          title="Send"
          time="10 min ago"
          message="1.30 ETH sent to 0x36246976 🤝"
          style={styles.notification}
        />
        <Notification
          type="exchange"
          title="Exchange"
          time="1 day ago"
          message="1.30 ETH  exchanged to 0.2 BTC 🤝"
          style={styles.notification}
        />
        <Notification
          type="success"
          title="Successful"
          time="1 day ago"
          message="This action has been successful."
          style={styles.notification}
        />
        <Notification
          type="error"
          title="Swap "
          time="1 day ago"
          message="This action could not be executed."
          style={styles.notification}
        />
        <Notification
          type="info"
          title="Update "
          time="2 days ago"
          message="This action could not be executed."
          style={styles.notification}
        />

        <History />
      </View>
    </Layout>
  );
};

const historyStyles = StyleSheet.create({
  header: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  headerIconContainer: {
    height: 24,
    width: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    flexDirection: 'column',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 16,
  },
  itemProgressContainer: {
    alignItems: 'center',
    marginRight: 18,
  },
  itemProgressBullet: {
    height: 8,
    width: 8,
    borderRadius: 8 / 2,
    backgroundColor: colors.green,
  },
  itemProgressLineBefore: {
    height: 20,
    width: 1,
    backgroundColor: colors.green,
  },
  itemProgressLineAfter: {
    height: 20,
    width: 1,
    backgroundColor: colors.green,
  },
  itemText: {
    color: colors.neutral600,
    flexGrow: 1,
  },
  itemActionContainer: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  footer: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 16,
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const styles = StyleSheet.create({
  notification: {
    marginBottom: 12,
  },
});

export default Notifications;
