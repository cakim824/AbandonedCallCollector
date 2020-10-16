require('dotenv').config();
const dayjs = require('dayjs');
const {
  forEach,
  values,
  split,
  pipe,
  head,
  tail,
  last,
  forEachObjIndexed,
  length,
  complement,
} = require('ramda');
const path = require('path');
const {
  Logger
} = require('./logger');

const DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const promiseHandler = promise =>
  promise
    .then(data => ({
      data,
      err: null,
    }))
    .catch(err => ({
      data: null,
      err,
    }));

const decodeError = error =>
  `error.name:${error.name}|error.message:${error.message}`;

const responseError = (errorCode, errorMessage) => ({
  success: false,
  errorCode,
  errorMessage,
});

const responseSuccess = rows => ({
  success: true,
  result: rows,
});

const handleResponse = response => (response.success ? response.result : Promise.reject(new Error('문제 발생')));

const getFilename = fileFullpath => path.basename(fileFullpath);

const createLogger = __filename => {
  const filename = getFilename(__filename);
  return Logger(filename);
};

const splitDateTime = split(' ');
const splitTime = split(':');

const getDatetime = (datetime_format = DEFAULT_DATETIME_FORMAT) =>
  moment().format(datetime_format);
const getDatetimeDayjs = () =>
  new Date().toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
const getDate = pipe(
  splitDateTime,
  head,
);
const getTime = pipe(
  splitDateTime,
  last,
);
const getHour = pipe(
  splitTime,
  head,
);
const getMinute = pipe(
  splitTime,
  tail,
  head,
);
const getSecond = pipe(
  splitTime,
  last,
);

const getStartTimestamp = currentDate =>
  dayjs(currentDate)
    .subtract(1, 'minute')
    .unix();
const getEndTimestamp = currentDate =>
  dayjs(currentDate)
    .subtract(1, 'second')
    .unix();

const checkExecCallCatcherJob = second => second === process.env.TIME_INTERVAL;

const isEmpty = value => !value;

const checkMadatoryParameter = (value, key) => {
  if (isEmpty(value)) {
    throw new Error(`${key} 값이 없습니다.`)
  }
  return false;
}

const checkMandatoryParameters = forEachObjIndexed(checkMadatoryParameter);

const lengthNotZero = data => length(data) > 0;

const isOverThenZero = value => value > 0;

const isNotEmpty = complement(isEmpty);

module.exports = {
  createLogger,
  head,
  forEach,
  values,
  getDatetime,
  getDate,
  getTime,
  getHour,
  getMinute,
  getSecond,
  checkExecCallCatcherJob,
  promiseHandler,
  decodeError,
  responseError,
  responseSuccess,
  handleResponse,
  getStartTimestamp,
  getEndTimestamp,
  checkMandatoryParameters,
  lengthNotZero,
  isOverThenZero,
  isNotEmpty,
};
