export const CHAT_PAGE_SIZE = 7;

export const WEEK_ARRAY = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'Ok'];

export const MONTH_ARRAY = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

export const ZOOM_SDK_KEY = 'f9yfxQmctOADmf4b9yz9ajiXUyPlxDhycVQP';

export const ONBOARDING_PAGES = {
  START_SCREEN: 0,
  HOSPITAL: 1,
  STATION: 2,
  BIRTHDAY: 3,
  SERNAME: 4,
  NAME: 5,
  PREVIEW: 6,
  NOTIFICATION: 7,
};

export const ONBOARDING_MATCH_STATUSES = {
  SUCCESSFUL: 0,
  UNSUCCESSFUL_WITH_TRIES: 1,
  UNSUCCESSFUL_WITHOUT_TRIES: 2,
}

// min 8 symbols, min 1 letter,min 1 number
export const passwordRegex = /^.*(?=.{8,})((?=.*\d)+)((?=.*[A-z]){1}).*$/;
