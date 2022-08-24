import React, {useState} from 'react';
import {GestureResponderEvent, StyleSheet, View} from 'react-native';
import type {RootStackParamList} from '../components/Navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import {colors} from '../styles';

import Layout from '../components/Layout';
import CustomText from '../components/CustomText';
import Card from '../components/Card';
import CollapsibleArrow from '../components/CollapsibleArrow';
import SwitchCard from '../components/SwitchCard';

const SettingCard: React.FC<{
  title: string;
  subtitle: string;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
}> = ({title, subtitle, onPress}) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.cardInfo}>
        <CustomText weight="medium">{title}</CustomText>
        <CustomText style={styles.cardSubtitle}>{subtitle}</CustomText>
      </View>
      <CollapsibleArrow rotate={false} startArrowAngel="right" />
    </Card>
  );
};

const NotificationsSettings: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [isPaused, setIsPaused] = useState(true);

  return (
    <Layout
      stickyHeader
      header={{
        minimal: {title: 'Notifications settings', back: true},
      }}>
      <View style={styles.setting}>
        <CustomText
          weight="medium"
          style={[styles.settingTitle, {marginBottom: 12}]}>
          Push Notifications
        </CustomText>
        <SwitchCard
          title="All Notifications paused"
          isActive={isPaused}
          onToggle={isActive => setIsPaused(isActive)}
        />
      </View>

      <View style={styles.setting}>
        <CustomText
          weight="medium"
          style={[styles.settingTitle, {marginBottom: 4}]}>
          Customize notifications
        </CustomText>
        <CustomText
          weight="medium"
          style={[styles.settingSubtitle, {marginBottom: 12}]}>
          Choose the messages you’d like to receive
        </CustomText>

        <SettingCard
          title="Security alerts"
          subtitle="Email, SMS, In app"
          onPress={() => navigation.navigate('SecurityAlerts')}
        />
        <SettingCard
          title="Account activity"
          subtitle="Email, In app"
          onPress={() => navigation.navigate('AccountActivity')}
        />
        <SettingCard
          title="Price alerts"
          subtitle="Push, In app"
          onPress={() => navigation.navigate('PriceAlerts')}
        />
        <SettingCard
          title="Product announcements"
          subtitle="Push, In app"
          onPress={() => navigation.navigate('ProductAnnouncements')}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  setting: {
    marginBottom: 16,
  },
  settingTitle: {
    fontSize: 18,
  },
  settingSubtitle: {
    marginBottom: 12,
    color: colors.neutral500,
  },
  card: {
    marginBottom: 12,
  },
  cardInfo: {
    paddingRight: 12,
    marginRight: 'auto',
  },
  cardSubtitle: {
    color: colors.neutral500,
  },
});

export default NotificationsSettings;
