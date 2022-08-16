import React from 'react';

import {StyleSheet, View} from 'react-native';

import {colors} from '../styles';

import Layout from '../components/Layout';
import Card from '../components/Card';
import CustomText from '../components/CustomText';
import SwitchCard from '../components/SwitchCard';

import LockSvg from '../assets/icons/lock.svg';

const SecurityAlerts: React.FC = () => {
  return (
    <Layout
      accent="white"
      header={{minimal: {title: 'Security alerts', back: true}}}>
      <Card style={styles.preview}>
        <CustomText weight="medium" style={styles.previewTitle}>
          Security alert preview
        </CustomText>

        <View style={styles.previewInfo}>
          <View style={styles.previewInfoIconContainer}>
            <LockSvg height={17} width={13} color={colors.blue} />
          </View>

          <CustomText>Your password has been reset</CustomText>
          <CustomText weight="medium" style={styles.previewInfoDate}>
            Jan 1
          </CustomText>
        </View>
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
          title="Email"
          label="required"
          isActive={false}
          onToggle={() => {}}
          style={styles.settingCard}
        />
        <SwitchCard
          title="SMS"
          label="required"
          isActive={false}
          onToggle={() => {}}
          style={styles.settingCard}
        />
        <SwitchCard
          title="In App"
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
    color: colors.neutral500,
    marginBottom: 8,
  },
  previewInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  previewInfoIconContainer: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  previewInfoDate: {
    paddingLeft: 8,
    marginLeft: 'auto',
    fontSize: 12,
    lineHeight: 16,
    color: colors.neutral400,
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

export default SecurityAlerts;
