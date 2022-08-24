import React from 'react';

import {StyleSheet, View} from 'react-native';

import {colors} from '../styles';

import Layout from '../components/Layout';
import Card from '../components/Card';
import CustomText from '../components/CustomText';
import SwitchCard from '../components/SwitchCard';
import Notification from '../components/Notification';

const PriceAlerts: React.FC = () => {
  return (
    <Layout
      stickyHeader
      header={{minimal: {title: 'Price Alerts', back: true}}}>
      <Card style={styles.preview}>
        <CustomText weight="medium" style={styles.previewTitle}>
          Price alert preview
        </CustomText>

        <Notification
          title="Price Alert"
          time="2 min ago"
          message="📊  Bitcoin (BTC) is down 5.98% 
          to SGD41,433,58 in the last 24 hours."
          style={styles.previewNotification}
        />
      </Card>

      <View style={styles.setting}>
        <CustomText weight="medium" style={styles.settingTitle}>
          Preferences
        </CustomText>
        <CustomText style={styles.settingSubtitle}>
          Tell us how you’d like to be notified
        </CustomText>

        <SwitchCard
          title="Push"
          isActive
          onToggle={() => {}}
          style={styles.settingCard}
        />
        <SwitchCard
          title="In App"
          isActive
          onToggle={() => {}}
          style={styles.settingCard}
        />
        <SwitchCard
          title="Email"
          isActive
          onToggle={() => {}}
          style={styles.settingCard}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  preview: {
    marginBottom: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingRight: 20,
  },
  previewTitle: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
    color: colors.neutral500,
  },
  previewNotification: {
    padding: 0,
    borderWidth: 0,
  },
  setting: {
    marginBottom: 16,
  },
  settingTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  settingSubtitle: {
    color: colors.neutral500,
    marginBottom: 12,
  },
  settingCard: {
    marginBottom: 12,
  },
});

export default PriceAlerts;
