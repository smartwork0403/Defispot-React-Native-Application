import React from 'react';

import {StyleSheet, View, Image} from 'react-native';

import {colors} from '../styles';

import Layout from '../components/Layout';
import Card from '../components/Card';
import CustomText from '../components/CustomText';
import SwitchCard from '../components/SwitchCard';

const ProductAnnouncements: React.FC = () => {
  return (
    <Layout
      stickyHeader
      header={{minimal: {title: 'Product announcements', back: true}}}>
      <Card style={styles.preview}>
        <CustomText weight="medium" style={styles.previewTitle}>
          Price alert preview
        </CustomText>

        <View style={styles.previewContent}>
          <Image
            source={require('../assets/images/sample.png')}
            style={styles.previewContentImage}
          />
          <CustomText weight="medium" style={styles.previewContentTitle}>
            SOL now available to trade!
          </CustomText>
          <CustomText weight="medium" style={styles.previewContentDate}>
            10 min ago
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
    marginBottom: 8,
    color: colors.neutral500,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewContentImage: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    marginRight: 12,
  },
  previewContentTitle: {
    flexGrow: 1,
  },
  previewContentDate: {
    marginLeft: 16,
    color: colors.neutral400,
    fontSize: 12,
    lineHeight: 16,
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

export default ProductAnnouncements;
