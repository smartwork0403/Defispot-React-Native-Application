import React, {useState} from 'react';
import {ScrollView, View, StyleSheet, Pressable} from 'react-native';
import {VictoryPie} from 'victory-native';
import {colors, globalStyles} from '../styles';

import Button from '../components/Button';
import CustomText from '../components/CustomText';
import Header from '../components/Header';
import Layout from '../components/Layout';
import TradeCompleteModal from '../components/TradeCompleteModal';
import TradeConfirmModal from '../components/TradeConfirmModal';
import TradeModule from '../components/TradeModule';

const TradeScreen: React.FC = () => {
  const [isDeposit, setIsDeposit] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  return (
    <Layout
      customContent={
        <>
          <ScrollView>
            <Header title="Trade" minimal />
            <View style={{...styles.content, ...globalStyles.wrapper}}>
              <View style={{...styles.slippage, ...globalStyles.shadow}}>
                <CustomText>Slippage</CustomText>
                <CustomText weight="medium" style={styles.slippagePercent}>
                  12%
                </CustomText>
                <Button
                  text
                  noPadding
                  textAccent="blue"
                  onPress={() => setIsCompleteModalOpen(true)}>
                  Edit
                </Button>
              </View>

              <TradeModule />

              <View style={styles.details}>
                <View style={styles.detail}>
                  <CustomText style={styles.detailTitle}>Equity</CustomText>
                  <CustomText weight="medium">$0,00</CustomText>
                </View>
                <View style={styles.detail}>
                  <CustomText style={styles.detailTitle}>
                    Buying Power
                  </CustomText>
                  <CustomText weight="medium">$99,99</CustomText>
                </View>
                <View style={styles.detail}>
                  <CustomText style={styles.detailTitle}>
                    Margin Usage
                  </CustomText>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}>
                    <CustomText weight="medium" style={{marginRight: 8}}>
                      7,83%
                    </CustomText>
                    <VictoryPie
                      height={16}
                      width={16}
                      data={[
                        {x: 'filled', y: 50},
                        {x: 'unfilled', y: 50},
                      ]}
                      colorScale={[colors.blue, colors.neutral200]}
                      labels={() => null}
                      padding={0}
                      innerRadius={5}
                    />
                  </View>
                </View>

                <Button disabled style={styles.action} accent="black">
                  Preview Swap
                </Button>
              </View>
            </View>
          </ScrollView>

          <View style={styles.switchContainer}>
            <View style={{...styles.switch, ...globalStyles.wrapper}}>
              <Pressable
                onPress={() => setIsDeposit(true)}
                style={{
                  ...styles.switchBtn,
                  backgroundColor: isDeposit
                    ? colors.neutral0
                    : colors.neutral100,
                  ...(isDeposit ? globalStyles.shadow : []),
                }}>
                <CustomText
                  weight="medium"
                  style={{
                    ...styles.switchText,
                    color: isDeposit ? colors.neutral900 : colors.neutral400,
                  }}>
                  Deposit
                </CustomText>
              </Pressable>

              <Pressable
                onPress={() => setIsDeposit(false)}
                style={{
                  ...styles.switchBtn,
                  backgroundColor: !isDeposit
                    ? colors.neutral0
                    : colors.neutral100,
                  ...(!isDeposit ? globalStyles.shadow : []),
                }}>
                <CustomText
                  weight="medium"
                  style={{
                    ...styles.switchText,
                    color: !isDeposit ? colors.neutral900 : colors.neutral400,
                  }}>
                  Withdraw
                </CustomText>
              </Pressable>
            </View>
          </View>

          <TradeConfirmModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
          />
          <TradeCompleteModal
            isOpen={isCompleteModalOpen}
            onClose={() => setIsCompleteModalOpen(false)}
          />
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    paddingBottom: 50,
    paddingRight: 16,
    paddingLeft: 16,
  },
  slippage: {
    backgroundColor: colors.neutral0,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 16,
    paddingLeft: 16,
    marginBottom: 16,
  },
  slippagePercent: {
    fontSize: 12,
    lineHeight: 16,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 8,
    paddingLeft: 8,
    marginLeft: 4,
    backgroundColor: colors.neutral50,
    marginRight: 'auto',
    borderRadius: 100,
  },
  details: {
    marginTop: 16,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailTitle: {
    color: colors.neutral500,
    marginRight: 16,
  },
  action: {
    marginTop: 8,
  },
  switchContainer: {
    backgroundColor: colors.neutral0,
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 16,
    paddingLeft: 16,
  },
  switch: {
    flexDirection: 'row',
    backgroundColor: colors.neutral100,
    padding: 4,
    borderRadius: 100,
  },
  switchBtn: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 16,
    paddingLeft: 16,
    borderRadius: 100,
    flexGrow: 1,
  },
  switchText: {
    textAlign: 'center',
  },
});

export default TradeScreen;
