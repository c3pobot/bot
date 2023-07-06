/*
Logger class for easy and aesthetically pleasing console logging
*/
const chalk = require('chalk');

const Level = {};
Level.ERROR = 'error';
Level.WARN = 'warn';
Level.INFO = 'info';
Level.DEBUG = 'debug';

const LevelMap = {};
LevelMap[Level.ERROR] = 4;
LevelMap[Level.WARN] = 3;
LevelMap[Level.INFO] = 2;
LevelMap[Level.DEBUG] = 1;

let logLevel;
function setLevel(level = Level.INFO) {
  if (LevelMap.hasOwnProperty(level)) {
    logLevel = LevelMap[level];
  } else {
    logLevel = LevelMap[Level.INFO];
  }
}
setLevel(Level.INFO);

module.exports.Level = Level;

function log(type, content, ...args) {
  if (logLevel <= LevelMap[type]) {
    const timestamp = `[${moment().format('HH:mm:ss')}]:`;
    switch (type) {
      case Level.ERROR: {
        return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content}`, ...args);
      }
      case Level.WARN: {
        return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content}`, ...args);
      }
      case Level.INFO: {
        return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content}`, ...args);
      }
      case Level.DEBUG: {
        return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content}`, ...args);
      }
      default: throw new TypeError('Logger type must be either error, warn, info/log, or debug.');
    }
  }
};

module.exports.setLevel = setLevel;
module.exports.error = (...args) => log(Level.ERROR, ...args);
module.exports.warn = (...args) => log(Level.WARN, ...args);
module.exports.info = (...args) => log(Level.INFO, ...args);
module.exports.log = (...args) => log(Level.INFO, ...args);
module.exports.debug = (...args) => log(Level.DEBUG, ...args);
