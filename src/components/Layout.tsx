import React, {useEffect, type PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {globalStyles} from '../styles';

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
}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      {!CustomContent ? (
        <ScrollView>
          {header && <Header {...header} />}
          <View style={[styles.content, contentStyle]}>{children}</View>
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
  container: {
    maxWidth: 900,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
  },
  content: {
    padding: 16,
    ...globalStyles.wrapper,
  },
});

export default Layout;
