require('dotenv').config();
require('winston-daily-rotate-file');
const {
  createLogger,
  format,
  transports
} = require('winston');

const {
  combine,
  timestamp,
  label,
  printf,
  colorize
} = format;

const isDevOrProd = mode => mode === 'production' || mode === 'development';

const dayjs = require('dayjs');

const LOG_FILE_PREFIX = process.env.LOG_FILE_PREFIX || 'app';
const LOG_TIME_FORMAT = process.env.LOG_TIME_FORMAT || 'YYYY-MM-DD HH:mm:ss';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const LOG_DIRNAME = process.env.LOG_DIRNAME || './logs';

const logTime = () => dayjs().format(LOG_TIME_FORMAT);
const myFormat = filename =>
  format.printf(
    opts =>
    `[${opts.level}][${logTime()}]${filename ? `[${filename}]` : ''}${
        opts.message
      }`,
  );

const transport = new transports.DailyRotateFile({
  level: 'info',
  dirname: LOG_DIRNAME,
  filename: `${LOG_FILE_PREFIX}-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '14d',
});

// const errorTransport = new (winston.transports.DailyRotateFile)({
//   level: 'error',
//   dirname: LOG_DIRNAME,
//   filename: `${LOG_FILE_PREFIX}-%DATE%.log`,
//   datePattern: 'YYYY-MM-DD',
//   zippedArchive: true,
//   maxSize: '20m',
//   maxFiles: '14d'
// });

const exceptionHandler = new transports.DailyRotateFile({
  level: 'error',
  dirname: LOG_DIRNAME,
  filename: `${LOG_FILE_PREFIX}-error-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  handleExceptions: true,
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '14d',
});

function prodFormat() {
  const replaceError = ({
    label,
    level,
    message,
    stack
  }) => ({
    label,
    level,
    message,
    stack,
  });
  const replacer = (key, value) =>
    value instanceof Error ? replaceError(value) : value;
  return combine(
    label({
      label: 'call-catcher',
    }),
    format.json({
      replacer,
    }),
  );
}

function devFormat() {
  const formatMessage = info =>  `${info.timestamp} ${info.level} ${info.message}`;
  const formatError = info => `${info.level} ${info.message}\n\n${info.stack}\n`;
  const format = info => info instanceof Error ? formatError(info) : formatMessage(info);
  return combine(
    colorize(), 
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }), 
    printf(format)
  );
}

const logger = createLogger({
  level: 'info',
  format: isDevOrProd(process.env.NODE_ENV) ? prodFormat() : devFormat(),
  // format: format.combine(
  //   format.splat(),
  //   myFormat(),
  //   devFormat()
  // ),
  // format: winston.format.json(),
  transports: [
    transport
  ],
  exceptionHandlers: [
    exceptionHandler
  ]
});

if (!isDevOrProd(process.env.NODE_ENV)) {
  logger.add(
    new transports.Console({
      level: 'debug',
      format: format.simple(),
    }),
  );
}

module.exports = logger;