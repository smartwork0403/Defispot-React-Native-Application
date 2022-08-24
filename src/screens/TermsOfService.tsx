import React from 'react';
import {StyleSheet} from 'react-native';

import {colors} from '../styles';

import Layout from '../components/Layout';
import CustomText from '../components/CustomText';

const TermsOfService: React.FC = () => {
  return (
    <Layout
      backgroundColor={colors.neutral0}
      header={{minimal: {title: 'Terms of Service', back: true}}}>
      <CustomText style={styles.text}>
        We may also refuse to complete or block, cancel or reverse a transaction
        you have authorised where there is insufficient E-Money in your E-Money
        Wallet and / or insufficient Digital Currency in your Digital Currency
        Wallet to cover the transaction and (where applicable) associated fees
        at the time that we receive notification of the transaction or if your
        credit or debit card or any other valid payment method linked to your
        Coinbase Account or Digital Currency Wallet is declined.
      </CustomText>

      <CustomText weight="medium" style={styles.title}>
        6. TRANSACTIONS LIMITS AND ENHANCED
      </CustomText>
      <CustomText style={[styles.text]}>
        7.2 If we refuse to complete a transaction and / or suspend, restrict or
        close your Coinbase Account, and / or terminate your use of Coinbase
        Services, we will (unless it would be unlawful for us to do so) provide
        you with notice of our actions and the reasons for refusal, suspension
        or closure, and where appropriate, with the procedure for correcting any
        factual errors that led to the refusal, suspension or closure of your
        Coinbase Account. In the event that we refuse to complete a transaction
        and / or suspend your Coinbase Account we will lift the suspension or
        complete the transaction as soon as reasonably practicable once the
        reasons for refusal and / or suspension no longer exist. However, we are
        under no obligation to allow you to reinstate a transaction at the same
        price or on the same terms as the suspended, reversed or cancelled
        transaction.
      </CustomText>
    </Layout>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
  },
  text: {
    color: colors.neutral600,
    marginBottom: 16,
  },
});

export default TermsOfService;
