import React from 'react';
import {View, StyleSheet} from 'react-native';

import Layout from '../components/Layout';
import Notification from '../components/Notification';

const NotificationsScreen: React.FC = () => {
  return (
    <Layout
      accent="white"
      header={{
        title: 'Notifications',
        minimal: {title: 'Notifications', back: true},
      }}
      contentStyle={{paddingBottom: 4}}>
      <View>
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
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  notification: {
    marginBottom: 12,
  },
});

export default NotificationsScreen;
