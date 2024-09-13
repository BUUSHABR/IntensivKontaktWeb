import { MONTH_ARRAY, WEEK_ARRAY } from './constants';

type dateStatusType = 'time' | 'chatDate' | 'gallery';

const getFormattedDate = (date: Date, dateStatus: dateStatusType) => {
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const weekDay = date.getDay();
  const month = date.getMonth();
  const day = date.getUTCDate();
  const year = date.getFullYear();

  if (dateStatus === 'time') {
    return `${addedZeroIfNeedForNumber(hours)}:${addedZeroIfNeedForNumber(minutes)}`;
  }

  if (dateStatus === 'chatDate') {
    return `${WEEK_ARRAY[weekDay]}. ${day}. ${MONTH_ARRAY[month]}`;
  }

  if (dateStatus === 'gallery') {
    return `${addedZeroIfNeedForNumber(day)}.${addedZeroIfNeedForNumber(
      month,
    )}.${year} um ${addedZeroIfNeedForNumber(hours)}:${addedZeroIfNeedForNumber(minutes)}`;
  }
};

export const addedZeroIfNeedForNumber = (num: number) => {
  if (num > 9) {
    return num;
  } else {
    return '0' + num;
  }
};
export default getFormattedDate;
