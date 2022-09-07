import React, {type PropsWithChildren} from 'react';
import {
  ScrollView,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  StatusBar,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {colors, globalStyles} from '../styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Header from './Header';
import {Props as HeaderProps} from './Header';

import NoInternet from './NoInternet';

interface Props {
  header?: HeaderProps;
  stickyHeader?: boolean;
  footer?: React.ReactNode;
  customStickyHeader?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  statusBarColor?: string;
  pulldownRefresh?: {
    isRefreshing: boolean;
    onRefresh: () => void;
  };
  loading?: boolean;
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
  pulldownRefresh,
  loading,
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

      {loading ? (
        <SafeAreaView
          style={[
            styles.loadingContainer,
            {
              backgroundColor: backgroundColor,
            },
          ]}>
          <ActivityIndicator size="large" color={colors.blue} />
        </SafeAreaView>
      ) : (
        <SafeAreaView style={{flex: 1, backgroundColor: backgroundColor}}>
          {stickyHeader ? (
            <>
              {header && <Header {...header} />}
              {!header && customStickyHeader ? customStickyHeader : null}
              <ScrollView
                // bounces={false}
                refreshControl={
                  pulldownRefresh ? (
                    <RefreshControl
                      style={{position: 'relative', zIndex: 10}}
                      refreshing={pulldownRefresh?.isRefreshing}
                      onRefresh={pulldownRefresh?.onRefresh}
                    />
                  ) : undefined
                }>
                {Platform.OS === 'ios' && <View style={styles.iosPullDown} />}
                <View style={[styles.content, contentStyle]}>{children}</View>
              </ScrollView>
              {footer && footer}
            </>
          ) : (
            <>
              <ScrollView
                // bounces={false}
                refreshControl={
                  pulldownRefresh ? (
                    <RefreshControl
                      style={{position: 'relative', zIndex: 10}}
                      refreshing={pulldownRefresh?.isRefreshing}
                      onRefresh={pulldownRefresh?.onRefresh}
                    />
                  ) : undefined
                }>
                {header && <Header {...header} />}
                {Platform.OS === 'ios' && <View style={styles.iosPullDown} />}
                <View style={[styles.content, contentStyle]}>{children}</View>
              </ScrollView>
              {footer && footer}
            </>
          )}

          <NoInternet />
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    ...globalStyles.wrapper,
  },
  iosPullDown: {
    backgroundColor: colors.neutral0,
    height: 1000,
    position: 'absolute',
    top: -1000,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});

export default Layout;
