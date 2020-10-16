const log = require('../utils/logger');
const { 
  getTimestamp,
  getStartTimestampDaily,
  getEndTimestampDaily,
  isNotValidDailyDate,
  getStartTimestampOfDay,
  getEndTimestampOfDay,
} = require('../utils/date-helper');

const { callCatcherJob } = require('../jobs');

const help = () => {
  console.log('사용법: yarn recovery:call-catcher <start_date> <end_date>');
  console.log('ex.     yarn recovery:call-catcher 20190301 20190312');
}

const recoveryCallCatcherData = async (start_date = '', end_date = '') => {
  if (isNotValidDailyDate(start_date) || isNotValidDailyDate(end_date)) {
    help();
    return false;
  }

  const start_timestamp = getStartTimestampOfDay(start_date);
  const end_timestamp = getEndTimestampOfDay(end_date);
  console.log("start_timestamp: " + start_timestamp + ", end_timestamp: " + end_timestamp);

  const affected_rows = await callCatcherJob(start_timestamp, end_timestamp);

  log.info(`recovery call-catcher date range: ${start_date} ~ ${end_date} excute affected_rows: ${affected_rows}`);
};

module.exports = {
  recoveryCallCatcherData,
};
