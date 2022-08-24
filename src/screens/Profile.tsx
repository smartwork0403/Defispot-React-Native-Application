import React, {useState} from 'react';
import {GestureResponderEvent, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {
  RootStackParamList,
  ProfileStackParamList,
} from '../components/Navigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {colors, globalStyles} from '../styles';

import Layout from '../components/Layout';
import CustomText from '../components/CustomText';
import CollapsibleArrow from '../components/CollapsibleArrow';
import ProfileDangerZoneModal from '../components/ProfileDangerZoneModal';
import Card from '../components/Card';
import NativeCurrencyPickerModal from '../components/NativeCurrencyPickerModal';
import CountryPickerModal from '../components/CountryPickerModal';

import FlowerShapeSvg from '../assets/icons/flower-shape.svg';
import DiscordSvg from '../assets/icons/discord.svg';
import NewspaperSvg from '../assets/icons/newspaper.svg';

const CardItem: React.FC<{
  title: string;
  icon?: any;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
}> = ({title, icon: Icon, onPress}) => {
  return (
    <Card style={cardStyles.card} onPress={onPress}>
      {Icon && (
        <View style={cardStyles.cardIconContainer}>
          <Icon height={13} width={15} color={colors.neutral400} />
        </View>
      )}
      <CustomText weight="medium" style={cardStyles.cardTitle}>
        {title}
      </CustomText>
      <CollapsibleArrow rotate={false} startArrowAngel="right" />
    </Card>
  );
};

const Profile: React.FC = () => {
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList & ProfileStackParamList>
    >();

  const [isProfileDangerZoneModalOpen, setIsProfileDangerZoneModalOpen] =
    useState(false);
  const [isNativeCurrencyPickerModalOpen, setIsNativeCurrencyPickerModalOpen] =
    useState(false);
  const [isCountryPickerModalOpen, setIsCountryPickerModalOpen] =
    useState(false);

  return (
    <Layout
      stickyHeader
      header={{
        minimal: {
          title: 'Profile',
          back: true,
        },
      }}
      contentStyle={{
        padding: 0,
      }}>
      <View style={[styles.overview, globalStyles.shadow]}>
        <View style={styles.overviewIconContainer}>
          <FlowerShapeSvg height={24} width={24} color={colors.blueDark} />
        </View>

        <View>
          <CustomText style={styles.overviewEmail}>
            kevin@fintory.com
          </CustomText>
          <CustomText weight="medium" style={styles.overviewName}>
            Kevin Dukkon
          </CustomText>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.setting}>
          <CustomText weight="medium" style={styles.settingTitle}>
            Account
          </CustomText>

          <CardItem
            title="Native currency"
            onPress={() => setIsNativeCurrencyPickerModalOpen(true)}
          />
          <CardItem
            title="Country"
            onPress={() => setIsCountryPickerModalOpen(true)}
          />
          <CardItem
            title="Export private key"
            onPress={() => setIsProfileDangerZoneModalOpen(true)}
          />
          <CardItem
            title="Notifications settings"
            onPress={() => navigation.navigate('NotificationsSettings')}
          />
        </View>

        <View style={styles.setting}>
          <CustomText weight="medium" style={styles.settingTitle}>
            General
          </CustomText>
          <CardItem title="Support" icon={DiscordSvg} />
          <CardItem
            title="Terms of Service"
            icon={NewspaperSvg}
            onPress={() => navigation.navigate('TermsOfService')}
          />
        </View>
      </View>

      <ProfileDangerZoneModal
        isOpen={isProfileDangerZoneModalOpen}
        onClose={() => setIsProfileDangerZoneModalOpen(false)}
        onContinuePress={() => {
          setIsProfileDangerZoneModalOpen(false);
          navigation.navigate('ExportPrivateKey');
        }}
      />

      <NativeCurrencyPickerModal
        isOpen={isNativeCurrencyPickerModalOpen}
        onClose={() => setIsNativeCurrencyPickerModalOpen(false)}
      />

      <CountryPickerModal
        isOpen={isCountryPickerModalOpen}
        onClose={() => setIsCountryPickerModalOpen(false)}
      />
    </Layout>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  cardIconContainer: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardTitle: {
    flexGrow: 1,
    marginLeft: 4,
  },
});

const styles = StyleSheet.create({
  overview: {
    backgroundColor: colors.neutral0,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewIconContainer: {
    height: 48,
    width: 48,
    borderRadius: 48 / 2,
    backgroundColor: colors.blueLight,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewEmail: {
    color: colors.neutral600,
  },
  overviewName: {
    fontSize: 18,
  },
  content: {
    padding: 16,
    paddingBottom: 0,
  },
  setting: {
    marginBottom: 6,
  },
  settingTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
});

export default Profile;
