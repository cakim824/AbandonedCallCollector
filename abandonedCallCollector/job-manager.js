const CronJob = require('cron').CronJob;
const {
  forEach,
  values
} = require('./utils/common')
const log = require('./utils/logger');

class JobManager {
  constructor(jobList) {
    this._jobList = jobList || [];
  }

  addJob(jobInfo) {
    if (!jobInfo) {
      throw new Error('jobInfo가 없습니다.');
    }
    try {
      const _jobInfo = values(jobInfo);
      const _job = this.createJob(..._jobInfo);
      this._jobList.push(_job);
    } catch (error) {
      throw error;
    }
  }

  createJob(
    cronTime,
    onTick,
    onComplete = null,
    start,
    timezone = 'Asia/Seoul',
    context,
    runOnInit,
    unrefTimeout,
  ) {
    try {
      return new CronJob(
        cronTime,
        onTick,
        onComplete,
        start,
        timezone
      )
    } catch (error) {
      // log.error(`[createJob]error:${error}`)
      throw error;
    }
  }

  loadJobList(jobList) {
    try {
      forEach(job => this.addJob(job), jobList);
      // forEach(this.addJob, jobList)
      log.info('[job-manager.js]loadJobList complete');
      return this;
    } catch (error) {
      throw error;
    }
  }

  showJobList() {
    log.info(`[[job-manager.js]]showJobList jobList:${this._jobList}`);
  }

  start() {
    try {
      this._jobList.forEach(job => job.start());
      log.info(`[job-manager.js]start complete`);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = JobManager;
