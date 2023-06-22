'use strict'

const MongoWrapper = require('mongowrapper')
global.mongo = new MongoWrapper({
  url: 'mongodb://'+process.env.MONGO_USER+':'+process.env.MONGO_PASS+'@'+process.env.MONGO_HOST+'/',
  authDb: process.env.MONGO_AUTH_DB,
  appDb: process.env.MONGO_DB,
  repSet: process.env.MONGO_REPSET
})
global.botReady = 0
global.mongoReady = 0
global.debugMsg = +process.env.DEBUG || 0
global.botSettings = {}
global.Que = require('./cmdQue')
const InitMongo = async()=>{
  try{
    const status = await mongo.init();
    if(status > 0){
      console.log('Mongo connection successful on bot-'+process.env.SHARD_NUM+'...')
      mongoReady++
      await UpdateBotSettings()
      require('./bot')
      require('./server')
    }else{
      console.log('Mongo error on bot-'+process.env.SHARD_NUM+'. Will try again in 10 seconds...')
      setTimeout(InitMongo, 10000)
    }
  }catch(e){
    console.error(e);
    console.error('Mongo error on bot-'+process.env.SHARD_NUM+'. Will try again in 10 seconds...')
    setTimeout(InitMongo, 10000)
  }
}
const UpdateBotSettings = async()=>{
  try{
    const obj = (await mongo.find('botSettings', {_id: "1"}))[0]
    if(obj) botSettings = obj
    setTimeout(UpdateBotSettings, 60000)
  }catch(e){
    console.error(e)
    setTimeout(UpdateBotSettings, 5000)
  }
}
InitMongo()
