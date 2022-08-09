import {StyleSheet} from 'react-native';

export const config = {
  MAX_CONTENT_WIDTH: 700,
};

export const colors = {
  blue: '#0077FF',
  blueLight: '#EBF4FF',
  blueDark: '#005FCC',

  green: '#00B674',
  greenLight: '#EBFFF8',
  greenDark: '#007A4E',

  red: '#EF4444',
  redLight: '#FDECEC',
  redDark: '#BC1010',

  neutral900: '#121315',
  neutral600: '#62626D',
  neutral500: '#8D8D94',
  neutral400: '#A1A1A8',
  neutral300: '#CFCED2',
  neutral200: '#E0E1E4',
  neutral100: '#EFF0F3',
  neutral50: '#F7F8FA',
  neutral0: '#fff',
};

export const fonts = {
  inter: 'Inter-Regular',
  interMedium: 'Inter-Medium',
  interSemiBold: 'Inter-SemiBold',
  interBold: 'Inter-Bold',

  circularStd: 'CircularStd-Regular',
  circularStdMedium: 'CircularStd-Medium',
  circularStdBold: 'CircularStd-Bold',
};

export const globalStyles = StyleSheet.create({
  wrapper: {
    maxWidth: config.MAX_CONTENT_WIDTH,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
  },

  shadow: {
    shadowColor: colors.neutral500,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 8,
  },
});
