import React, {type PropsWithChildren} from 'react';
import {
  ScrollView,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  StatusBar,
} from 'react-native';
import {colors, globalStyles} from '../styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Header from './Header';
import {Props as HeaderProps} from './Header';

interface Props {
  header?: HeaderProps;
  stickyHeader?: boolean;
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
  footer,
  customStickyHeader,
  contentStyle,
  backgroundColor,
  statusBarColor,
}) => {
  const insets = useSafeAreaInsets();

  const getStatusBarColor = () => {
    if (statusBarColor) {
      return statusBarColor;
    }

    return colors.neutral0;
  };

  return (
    <>
      <View style={{height: insets.top, backgroundColor: getStatusBarColor()}}>
        <StatusBar
          backgroundColor={getStatusBarColor()}
          barStyle="dark-content"
        />
      </View>

      <SafeAreaView style={{flex: 1, backgroundColor: backgroundColor}}>
        {stickyHeader ? (
          <>
            {header && <Header {...header} />}
            {!header && customStickyHeader ? customStickyHeader : null}
            <ScrollView bounces={false}>
              <View style={[styles.content, contentStyle]}>{children}</View>
            </ScrollView>
            {footer && footer}
          </>
        ) : (
          <>
            <ScrollView bounces={false}>
              {header && <Header {...header} />}
              <View style={[styles.content, contentStyle]}>{children}</View>
            </ScrollView>
            {footer && footer}
          </>
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    ...globalStyles.wrapper,
  },
});

export default Layout;
