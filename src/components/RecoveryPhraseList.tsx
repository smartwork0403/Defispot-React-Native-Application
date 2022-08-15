import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {colors} from '../styles';
import Button from './Button';
import CustomText from './CustomText';

export interface Props {
  list: {text: string; name: string}[];
  style?: StyleProp<ViewStyle>;
}

const RecoveryPhraseList: React.FC<Props> = ({list = [], style}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.list}>
        {list.map((phrase, index) => (
          <View style={styles.phrase} key={phrase.name}>
            <CustomText weight="medium" style={styles.phraseNum}>
              {index + 1}
            </CustomText>
            <CustomText weight="medium">{phrase.text}</CustomText>
          </View>
        ))}
      </View>
      <Button text>Copy to clipboard</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    paddingBottom: 24,
    paddingLeft: 36,
    paddingRight: 36,
    backgroundColor: colors.neutral50,
    alignItems: 'center',
  },
  list: {
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  phrase: {
    margin: 6,
    backgroundColor: colors.neutral0,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 4,
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  phraseNum: {
    marginRight: 4,
    color: colors.neutral300,
  },
});

export default RecoveryPhraseList;
