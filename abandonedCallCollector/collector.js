const job_list = require('./job-list');
const JobManager = require('./job-manager');
const jobManager = new JobManager();

jobManager
.loadJobList(job_list)
.start();
