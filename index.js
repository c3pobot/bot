'use strict'
process.on('unhandledRejection', (error) => {
  console.log(error)
});
require('./src')
