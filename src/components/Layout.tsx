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
import {colors, globalStyles} from '../styles';

import Header from './Header';
import {Props as HeaderProps} from './Header';

interface Props {
  header?: HeaderProps;
  stickyHeader?: boolean;
  accent?: 'white';
  footer?: React.ReactNode;
  customStickyHeader?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  statusBarColor?: string;
}

const Layout: React.FC<PropsWithChildren<Props>> = ({
  children,
  header,
  stickyHeader,
  accent,
  footer,
  customStickyHeader,
  contentStyle,
  backgroundColor,
  statusBarColor,
}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: backgroundColor}}>
      <StatusBar
        backgroundColor={
          statusBarColor
            ? statusBarColor
            : accent === 'white'
            ? colors.neutral0
            : colors.blue
        }
        barStyle={accent === 'white' ? 'dark-content' : 'default'}
        animated
      />

      {stickyHeader ? (
        <>
          {header && <Header {...header} accent={accent} />}
          {!header && customStickyHeader ? customStickyHeader : null}
          <ScrollView bounces={false}>
            <View style={[styles.content, contentStyle]}>{children}</View>
          </ScrollView>
          {footer && footer}
        </>
      ) : (
        <>
          <ScrollView bounces={false}>
            {header && <Header {...header} accent={accent} />}
            <View style={[styles.content, contentStyle]}>{children}</View>
          </ScrollView>
          {footer && footer}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    ...globalStyles.wrapper,
  },
});

export default Layout;
