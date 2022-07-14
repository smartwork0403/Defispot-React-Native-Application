// TODO: Duplicated code. See: amount.ts|toAbbreviate|ln 253
export const formatNumberString = (strValue: string) => {
  if (strValue) {
    let newValue = parseInt(strValue.replace(/,/g, ''), 10);
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Q', 'Q', 's'];
    let suffixNum = 0;

    while (newValue >= 1000) {
      newValue /= 1000;
      suffixNum++;
    }
    return `${newValue.toFixed(2)}${
      suffixNum > 0 ? `${suffixes[suffixNum]}` : ''
    }`;
  }
  return '0';
};
export const formatFloat = (newValue: number) => {
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Q', 'Q', 's'];
  let suffixNum = 0;

  while (newValue >= 1000) {
    newValue /= 1000;
    suffixNum++;
  }
  return `${newValue.toFixed(1)}${
    suffixNum > 0 ? `${suffixes[suffixNum]}` : ''
  }`;
};
