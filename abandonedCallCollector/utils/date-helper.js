const dayjs = require('dayjs');
const advancedFormat = require('dayjs/plugin/advancedFormat');

dayjs.extend(advancedFormat);
const {
  curry, 
  pipe,
  complement,
  isEmpty,
  equals,
  length,
  replace,
  and,
} = require('ramda')
const TEST_DATE = '20190122';
const HOUR_ROW_DATE = '20190122';
const HOUR_ROW_TIME = '1400';
const DAY_ROW_DATE = '20190122';
const DAY_ROW_TIME = '0000';
const MONTH_ROW_DATE = '20190101';
const MONTH_ROW_TIME = '0000';
const DEFAULT_DATE_FORMAT = 'YYYYMMDDHHmmss';
const convertDateFormat = date => {
  const YYYY = date.substring(0, 4);
  const MM = date.substring(4, 6);
  const DD = date.substring(6, 8);
  const HH = date.substring(8, 10);
  const mm = date.substring(10, 12);
  const ss = date.substring(12, 14);
  return `${YYYY}-${MM}-${DD}T${HH}:${mm}:${ss}`;
};
const DATE_TYPE_01 = '20190122140000';
const DATE_TYPE_02 = '20190122000000';
const DATE_TYPE_03 = '20160201000000';
const convertedDateType01 = convertDateFormat(DATE_TYPE_01);
const convertedDateType02 = convertDateFormat(DATE_TYPE_02);
const convertedDateType03 = convertDateFormat(DATE_TYPE_03);
const getHourStartDateTime = date => dayjs(date).format('YYYYMMDDHHmmss');
const getDayStartDateTime = date => dayjs(date).format('YYYYMMDDHHmmss');
const getMonthStartDateTime = date => dayjs(date).format('YYYYMMDDHHmmss');
const getEndDateTime = unit => startDate =>
  dayjs(startDate)
    .endOf(unit)
    .format('YYYYMMDDHHmmss');
const getHourEndDateTime = getEndDateTime('hour');
const getDayEndDateTime = getEndDateTime('day');
const getMonthEndDateTime = getEndDateTime('month');
const generateSchedulerDateTimeRange = curry((getStartDateTimeFn, getEndDateTimeFn, date, time) => {
  const convertedStartDateTime = convertDateFormat(`${date}${time}00`);
  const startDateTime = getStartDateTimeFn(convertedStartDateTime);
  const endDateTime = getEndDateTimeFn(convertedStartDateTime);
  return [startDateTime, endDateTime];
});
const generateSchedulerHourDateTimeRange = generateSchedulerDateTimeRange(getHourStartDateTime, getHourEndDateTime);
const generateSchedulerDayDateTimeRange = generateSchedulerDateTimeRange(getDayStartDateTime, getDayEndDateTime);
const generateSchedulerMonthDateTimeRange = generateSchedulerDateTimeRange(
  getMonthStartDateTime,
  getMonthEndDateTime,
);
const newDate = date => new Date(date);
const getDateDiff = (startDate, endDate) =>
  Math.abs(dayjs(endDate).diff(dayjs(startDate), 'second'));
const calculateDateDiff = (firstDate, secondDate) => {
  const fDate = newDate(convertDateFormat(firstDate));
  const sDate = newDate(convertDateFormat(secondDate));
  return getDateDiff(fDate, sDate);
};
// 콜백보고서 관련 시간 함수
// Todo
// 1. 현재 시간 1시간 전의 시간 범위(ex. 20190121153000 일 경우, 2019121140000~2019121145959 )
// 2. 현재 시간 하루 전의 시간 범위(ex. 20190121020000 일 경우, 2019120000000~2019120235959 )
const generatePreviousDateRange = unit => (format = DEFAULT_DATE_FORMAT) => {
  const currentDate = dayjs();
  const previousDate = currentDate.subtract(1, unit);
  const previousDateStart = previousDate.startOf(unit).format(format);
  const previousDateEnd = previousDate.endOf(unit).format(format);
  return [previousDateStart, previousDateEnd];
};
const generatePreviousDateHourRange = generatePreviousDateRange('hour');
const generatePreviousDateDayRange = generatePreviousDateRange('day');
const generatePreviousDateMonthRange = generatePreviousDateRange('month');
const getFormattedDate = date => date.format('YYYYMMDD');
/**
 * 최근 일자 데이터 범위
 */
const generateRecentDateRange = (recentDay = 7) => {
  const currentDate = dayjs();
  const previousDate = currentDate.subtract(recentDay - 1, 'day');
  const formattedCurrentDate = getFormattedDate(currentDate);
  const formattedPreviousDate = getFormattedDate(previousDate);
  return [formattedPreviousDate, formattedCurrentDate];
};
const getRowDate = date => date.substring(0, 8)
const getRowTime = date => date.substring(8, 12)
const ___testDate01 = '20190122210000';
const ___testDate02 = '20190122000000';
const ___testDate03 = '20190101000000';

const getCurrentDate = (date_format = 'YYYY-MM-DD HH:mm:ss') => dayjs().format(date_format);
const getTimestamp = date => dayjs(date).format('X');
const setTimestamp = ts => dayjs.unix(ts);
const subtractOneSecond = date => dayjs(date).subtract(1, 'second'); 
const subtractOneMinute = date => dayjs(date).subtract(1, 'minute'); 
const subtractTenMinutes = date => dayjs(date).subtract(10, 'minute'); 
const getTimestampBeforeOneMinute = pipe(
  subtractOneMinute,
  getTimestamp,
);
const getTimestampBeforeTenMinutes = pipe(
  subtractTenMinutes,
  getTimestamp,
);
const getTimestampBeforeOneSecond = pipe(
  subtractOneSecond,
  getTimestamp,
);
const getTimestampRangeBeforeOneMinuteFromDate = date => {
  const start_timestamp = getTimestampBeforeOneMinute(date);
  const end_timestamp = getTimestampBeforeOneSecond(date);
  return {
    start_timestamp,
    end_timestamp,
  }
};

const getTimestampRangeBeforeTenMinutesFromDate = date => {
  const start_timestamp = getTimestampBeforeTenMinutes(date);
  const end_timestamp = getTimestampBeforeOneSecond(date);
  return {
    start_timestamp,
    end_timestamp,
  }
};

const isValidDate = (date, format = 'YYYY-MM-DD') => dayjs(date, {format}).isValid();
// const _getDate = (date, format = 'YYYY-MM-DD') => dayjs(date, {format});
// const _getDate = (date, format = 'YYYY-MM-DD') => dayjs(date);
const _getDate = (date, format = 'YYYY-MM-DD') => dayjs(date).format('X');

const date_01 = '2019-03-12 14:00';
const date_02 = '2019-0312';
const date_03 = '20190312';
const date_04 = '';

const  getStartTimestampDaily = date => dayjs(date).startOf('day').format('X');
const  getEndTimestampDaily = date => dayjs(date).endOf('day').format('X');

const  getStartTimestampOfDay = date => dayjs(date).startOf('day').subtract(1, 'minute').unix();
const  getEndTimestampOfDay = date => dayjs(date).endOf('day').subtract(1, 'second').unix();

const isNotEmpty = complement(isEmpty);
const removeDash = replace(/-/g, '');
const equalsNumberEight = equals(8);

const validateDailyDate = pipe(
  removeDash,
  length,
  equalsNumberEight
);

const isValidDailyDate = and(isNotEmpty, validateDailyDate);
const isNotValidDailyDate = complement(isValidDailyDate);

module.exports = {
  DEFAULT_DATE_FORMAT,
  getDateDiff,
  newDate,
  convertDateFormat,
  calculateDateDiff,
  generatePreviousDateHourRange,
  generatePreviousDateDayRange,
  generatePreviousDateMonthRange,
  generateSchedulerHourDateTimeRange,
  generateSchedulerDayDateTimeRange,
  generateSchedulerMonthDateTimeRange,
  generateRecentDateRange,
  getRowDate,
  getRowTime,
  getCurrentDate,
  getTimestamp,
  setTimestamp,
  getTimestampRangeBeforeOneMinuteFromDate,
  getTimestampRangeBeforeTenMinutesFromDate,
  getStartTimestampDaily,
  getEndTimestampDaily,
  isNotValidDailyDate,
  getStartTimestampOfDay,
  getEndTimestampOfDay,
};
