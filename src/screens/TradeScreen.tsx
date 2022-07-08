import React, {useState} from 'react';
import {ScrollView, View, StyleSheet, Pressable} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import Button from '../components/Button';
import CustomText from '../components/CustomText';
import TradeModule from '../components/TradeModule';

const TradeScreen: React.FC = () => {
  const [isDeposit, setIsDeposit] = useState(true);

  return (
    <View
      style={{
        flex: 1,
      }}>
      <ScrollView>
        <View style={styles.header}>
          <CustomText style={styles.headerTitle}>Trade</CustomText>
        </View>

        <View style={styles.content}>
          <DropShadow
            style={{
              shadowColor: '#8d8d94',
              shadowOffset: {width: 2, height: 4},
              shadowRadius: 8,
              shadowOpacity: 0.06,
            }}>
            <View style={styles.slippage}>
              <CustomText>Slippage</CustomText>
              <CustomText style={styles.slippagePercent}>12%</CustomText>
              <Button text noPadding textAccent="blue">
                Edit
              </Button>
            </View>
          </DropShadow>

          <TradeModule />

          <View style={styles.details}>
            <View style={styles.detail}>
              <CustomText style={styles.detailTitle}>Equity</CustomText>
              <CustomText style={styles.detailValue}>$0,00</CustomText>
            </View>
            <View style={styles.detail}>
              <CustomText style={styles.detailTitle}>Buying Power</CustomText>
              <CustomText style={styles.detailValue}>$99,99</CustomText>
            </View>
            <View style={styles.detail}>
              <CustomText style={styles.detailTitle}>Margin Usage</CustomText>
              <CustomText style={styles.detailValue}>0</CustomText>
            </View>

            <Button disabled style={styles.action} accent="black">
              Preview Swap
            </Button>
          </View>
        </View>
      </ScrollView>

      <View style={styles.switchContainer}>
        <View style={styles.switch}>
          <DropShadow
            style={{
              shadowColor: '#8d8d94',
              shadowOffset: {width: 2, height: 4},
              shadowRadius: 8,
              shadowOpacity: isDeposit ? 0.08 : 0,
              flexGrow: 1,
            }}>
            <Pressable
              onPress={() => setIsDeposit(true)}
              style={{
                ...styles.switchBtn,
                backgroundColor: isDeposit ? '#fff' : '#EFF0F3',
              }}>
              <CustomText
                style={{
                  ...styles.switchText,
                  color: isDeposit ? '#121315' : '#A1A1A8',
                }}>
                Deposit
              </CustomText>
            </Pressable>
          </DropShadow>

          <DropShadow
            style={{
              shadowColor: '#8d8d94',
              shadowOffset: {width: 2, height: 4},
              shadowRadius: 8,
              shadowOpacity: isDeposit ? 0 : 0.08,
              flexGrow: 1,
            }}>
            <Pressable
              onPress={() => setIsDeposit(false)}
              style={{
                ...styles.switchBtn,
                backgroundColor: !isDeposit ? '#fff' : '#EFF0F3',
              }}>
              <CustomText
                style={{
                  ...styles.switchText,
                  color: !isDeposit ? '#121315' : '#A1A1A8',
                }}>
                Withdraw
              </CustomText>
            </Pressable>
          </DropShadow>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 50,
    paddingRight: 16,
    paddingLeft: 16,
  },
  header: {
    justifyContent: 'center',
    backgroundColor: '#0077FF',
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 24,
    paddingLeft: 24,
    marginBottom: 16,
  },
  headerTitle: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
    fontSize: 18,
  },
  slippage: {
    backgroundColor: '#fff',
    borderRadius: 24,
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
    fontFamily: 'Inter-Medium',
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 8,
    paddingLeft: 8,
    marginLeft: 4,
    backgroundColor: '#F7F8FA',
    marginRight: 'auto',
    borderRadius: 24,
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
    color: '#8D8D94',
    marginRight: 16,
  },
  detailValue: {
    fontFamily: 'Inter-Medium',
  },
  action: {
    marginTop: 8,
  },
  switchContainer: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 16,
    paddingLeft: 16,
  },
  switch: {
    flexDirection: 'row',
    backgroundColor: '#EFF0F3',
    padding: 4,
    borderRadius: 24,
  },
  switchBtn: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 16,
    paddingLeft: 16,
    borderRadius: 24,
  },
  switchText: {
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
});

export default TradeScreen;
