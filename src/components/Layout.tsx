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
  statusBarColor?: string;
}

const Layout: React.FC<PropsWithChildren<Props>> = ({
  children,
  header,
  contentStyle,
  customContent: CustomContent,
  statusBarColor = '#0077FF',
}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={statusBarColor} animated />
      {!CustomContent ? (
        <ScrollView>
          {header && <Header {...header} />}
          <View style={{...styles.content, ...contentStyle}}>{children}</View>
        </ScrollView>
      ) : (
        <>
          {header && <Header {...header} />}
          {CustomContent}
        </>
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
