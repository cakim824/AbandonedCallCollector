const { callCatcherJob } = require('./jobs');

const {
  getCurrentDate,
  getTimestampRangeBeforeOneMinuteFromDate,
  getTimestampRangeBeforeTenMinutesFromDate
} = require('./utils/date-helper');

const log = require('./utils/logger');

const CALL_CATCHER_CRON_TIME = '30 * * * * *';
const CALL_CATCHER_CRON_TIME_10MINS = '30 */10 * * * *';  // every 10 mins

const oneMinuteIntervalCallCatcherJobFn = async () => {
  try {
  const current_date = getCurrentDate('YYYY-MM-DD HH:mm');
  const { 
    start_timestamp,
    end_timestamp,
  } = getTimestampRangeBeforeOneMinuteFromDate(current_date)
  // log.info(
  //   `call-catcher job timestamp range: [${start_timestamp}~${end_timestamp}]`,
  // );
  const call_catcher_job_result = await callCatcherJob(start_timestamp, end_timestamp);
  // log.info(`call-catcher job insert rows: ${call_catcher_job_result}`);
} catch (error) {
  console.log(error);
}
};

const tenMinutesIntervalCallCatcherJobFn = async () => {
  try {
    const current_date = getCurrentDate('YYYY-MM-DD HH:mm');
    const { 
      start_timestamp,
      end_timestamp,
    } = getTimestampRangeBeforeTenMinutesFromDate(current_date)
  // log.info(
  //   `call-catcher job timestamp range: [${start_timestamp}~${end_timestamp}]`,
  // );
    const call_catcher_job_result = await callCatcherJob(start_timestamp, end_timestamp);
  // log.info(`call-catcher job insert rows: ${call_catcher_job_result}`);
  } catch (error) {
    console.log(error);
  }
};

const oneMinuteIntervalCallCatcherJob = {
  cronTime: CALL_CATCHER_CRON_TIME,
  onTick: oneMinuteIntervalCallCatcherJobFn,
  onComplete: null,
  start: false,
  timezone: 'Asia/Seoul',
};

const tenMinutesIntervalCallCatcherJob = {
  cronTime: CALL_CATCHER_CRON_TIME_10MINS,
  onTick: tenMinutesIntervalCallCatcherJobFn,
  onComplete: null,
  start: false,
  timezone: 'Asia/Seoul',
};

//const JOB_LIST = [oneMinuteIntervalCallCatcherJob];
const JOB_LIST = [tenMinutesIntervalCallCatcherJob];

module.exports = JOB_LIST;
