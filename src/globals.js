'use strict'
const MongoWrapper = require('mongowrapper')
global.mongo = new MongoWrapper({
  url: 'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@'+process.env.MONGO_HOST+'/',
  authDb: process.env.MONGO_AUTH_DB,
  appDb: process.env.MONGO_DB,
  repSet: process.env.MONGO_REPSET
})

global.basicCmdAllowedServers = []
global.privateServers = []

global.botReady = 0
global.mongoReady = 0
global.debugMsg = +process.env.DEBUG || 0
global.botSettings = {}
global.msgOpts = { private: [], basic: [], member: [], message: [], vip: [] }
global.Que = require('src/cmdQue')
global.socketInfo = {
  service: 'bot',
  type: 'server',
  id: +process.env.SHARD_NUM
}
