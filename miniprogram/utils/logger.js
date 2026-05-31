const { DEBUG } = require('../config/env');

const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const currentLevel = DEBUG ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN;

function log(level, tag, ...args) {
  if (level < currentLevel) return;

  const prefix = `[${tag}]`;
  switch (level) {
    case LOG_LEVEL.DEBUG:
      // eslint-disable-next-line no-console
      console.debug(prefix, ...args);
      break;
    case LOG_LEVEL.INFO:
      // eslint-disable-next-line no-console
      console.info(prefix, ...args);
      break;
    case LOG_LEVEL.WARN:
      console.warn(prefix, ...args);
      break;
    case LOG_LEVEL.ERROR:
      console.error(prefix, ...args);
      break;
  }
}

function debug(tag, ...args) {
  log(LOG_LEVEL.DEBUG, tag, ...args);
}

function info(tag, ...args) {
  log(LOG_LEVEL.INFO, tag, ...args);
}

function warn(tag, ...args) {
  log(LOG_LEVEL.WARN, tag, ...args);
}

function error(tag, ...args) {
  log(LOG_LEVEL.ERROR, tag, ...args);
}

module.exports = {
  LOG_LEVEL,
  log,
  debug,
  info,
  warn,
  error,
};
