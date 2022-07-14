import * as moment from 'moment';

export const getMomentDate = (date: string) =>
  moment.unix(Number(date ?? 0) / 1000000000);

export const getFormatted = (date: string, format = 'YYYYMMDD') =>
  getMomentDate(date).format(format);
