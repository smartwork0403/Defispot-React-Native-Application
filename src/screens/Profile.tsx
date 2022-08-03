import React from 'react';
import {StyleSheet, View} from 'react-native';

import Layout from '../components/Layout';
import CustomText from '../components/CustomText';
import CollapsibleCard from '../components/CollapsibleCard';

import FlowerShapeSvg from '../assets/icons/flower-shape.svg';
import MessageSvg from '../assets/icons/message.svg';

const ProfileScreen: React.FC = () => {
  return (
    <Layout
      header={{
        title: 'Profile',
        minimal: true,
      }}
      contentStyle={{
        padding: 0,
      }}>
      <View style={styles.overview}>
        <View style={styles.overviewIconContainer}>
          <FlowerShapeSvg height={24} width={24} color="#005FCC" />
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
          <CollapsibleCard
            style={styles.item}
            top={
              <View style={styles.itemTopContainer}>
                <CustomText weight="medium" style={styles.itemTitle}>
                  Native currency
                </CustomText>
              </View>
            }
            bottom={<CustomText>collapsed content</CustomText>}
            startArrowAngel="right"
          />

          <CollapsibleCard
            style={styles.item}
            top={
              <View style={styles.itemTopContainer}>
                <CustomText weight="medium" style={styles.itemTitle}>
                  Country
                </CustomText>
              </View>
            }
            bottom={<CustomText>collapsed content</CustomText>}
            startArrowAngel="right"
          />

          <CollapsibleCard
            style={styles.item}
            top={
              <View style={styles.itemTopContainer}>
                <CustomText weight="medium" style={styles.itemTitle}>
                  Privacy
                </CustomText>
              </View>
            }
            bottom={<CustomText>collapsed content</CustomText>}
            startArrowAngel="right"
          />

          <CollapsibleCard
            style={styles.item}
            top={
              <View style={styles.itemTopContainer}>
                <CustomText weight="medium" style={styles.itemTitle}>
                  Phone numbers
                </CustomText>
              </View>
            }
            bottom={<CustomText>collapsed content</CustomText>}
            startArrowAngel="right"
          />

          <CollapsibleCard
            style={styles.item}
            top={
              <View style={styles.itemTopContainer}>
                <CustomText weight="medium" style={styles.itemTitle}>
                  Notifications settings
                </CustomText>
              </View>
            }
            bottom={<CustomText>collapsed content</CustomText>}
            startArrowAngel="right"
          />
        </View>

        <View style={styles.setting}>
          <CustomText weight="medium" style={styles.settingTitle}>
            General
          </CustomText>
          <CollapsibleCard
            style={styles.item}
            top={
              <View style={styles.itemTopContainer}>
                <View style={styles.itemTopIconContainer}>
                  <MessageSvg height={13} width={15} color="#A1A1A8" />
                </View>
                <CustomText weight="medium" style={styles.itemTitle}>
                  Support
                </CustomText>
              </View>
            }
            bottom={<CustomText>collapsed content</CustomText>}
            startArrowAngel="right"
          />

          <CollapsibleCard
            style={styles.item}
            top={
              <View style={styles.itemTopContainer}>
                <View style={styles.itemTopIconContainer}>
                  <MessageSvg height={13} width={15} color="#A1A1A8" />
                </View>
                <CustomText weight="medium" style={styles.itemTitle}>
                  App Se
                </CustomText>
              </View>
            }
            bottom={<CustomText>collapsed content</CustomText>}
            startArrowAngel="right"
          />
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  overview: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewIconContainer: {
    height: 48,
    width: 48,
    borderRadius: 48 / 2,
    backgroundColor: '#EBF4FF',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewEmail: {
    color: '#62626D',
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
  item: {
    marginBottom: 12,
  },
  itemTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 'auto',
  },
  itemTopIconContainer: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  itemTitle: {
    paddingLeft: 4,
  },
});

export default ProfileScreen;
