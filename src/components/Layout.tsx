import React, {type PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import Header from './Header';
import {Props as HeaderProps} from './Header';

interface Props {
  header?: HeaderProps;
  contentStyle?: StyleProp<ViewStyle>;
  customContent?: React.ReactNode;
}

const Layout: React.FC<PropsWithChildren<Props>> = ({
  children,
  header,
  contentStyle,
  customContent: CustomContent,
}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor="#0077FF" />
      {!CustomContent ? (
        <ScrollView>
          {header && <Header {...header} />}
          <View style={{...styles.content, ...contentStyle}}>{children}</View>
        </ScrollView>
      ) : (
        CustomContent
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});

export default Layout;
