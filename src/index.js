'use strict'
const log = require('logger');
const rabbitmq = require('./rabbitmq');
const botMsgExchange = require('./botMsgExchange')
const { cmdMap } = require('./cmdMap')
const exchange = require('./exchange');

const bot = require('./bot')
const saveBotCmds = require('./saveBotCmds')

require('./expressServer')
const BOT_TOKEN = process.env.BOT_TOKEN, POD_NAME = process.env.POD_NAME || 'bot', SHARD_NUM = +(process.env.POD_INDEX || 0), NUM_SHARDS = +(process.env.NUM_SHARDS || 1)

const CheckRabbitMQ = ()=>{
  try{
    if(!rabbitmq?.status) log.debug(`rabbitmq is not ready...`)
    if(rabbitmq?.status){
      log.debug(`rabbitmq is ready...`)
      UpdateBotCmds()
      return
    }
    setTimeout(CheckRabbitMQ, 5000)
  }catch(e){
    log.error(e)
    setTimeout(CheckRabbitMQ, 5000)
  }
}
const UpdateBotCmds = async()=>{
  try{
    let status = true
    if(POD_NAME?.toString().endsWith("0")){
      status = await saveBotCmds('/app/src/localCmd', 'bot')
      syncNumBotShards()
    }
    if(status){
      CheckCmdMap()
      return
    }
    setTimeout(UpdateBotCmds, 5000)
  }catch(e){
    setTimeout(UpdateBotCmds, 5000)
    log.error(e)
  }
}
const CheckCmdMap = (count = 0)=>{
  try{
    if(Object.values(cmdMap)?.length > 0){
      log.debug(`cmdMap is ready...`)
      StartBot()
      return
    }
    log.debug(`cmdMap is not ready yet....`)
    setTimeout(CheckCmdMap, 5000)
  }catch(e){
    log.error(e)
    setTimeout(CheckCmdMap, 5000)
  }
}

const StartBot = ()=>{
  try{
    if(!NUM_SHARDS) throw('NUM_SHARDS not provided can\'t start bot....')
    if(SHARD_NUM < NUM_SHARDS){
      bot.login(BOT_TOKEN)
      StartExchange()
      return
    }
    throw(`not possible to create bot ${SHARD_NUM} of ${NUM_SHARDS}`)
  }catch(e){
    log.error(e)
    setTimeout(StartBot, 10000)
  }
}
const StartExchange = ()=>{
  try{
    if(bot?.isReady()){
      botMsgExchange.start()
      return
    }
    setTimeout(StartExchange, 5000)
  }catch(e){
    log.error(e)
    setTimeout(StartExchange, 5000)
  }
}
const syncNumBotShards = async()=>{
  try{
    let syncTime = 30, guildCount = bot?.guilds?.cache?.size
    let status = await rabbitmq.notify({ cmd: 'numBotShardsNotify',  numBotShards: NUM_SHARDS })
    if(!status) syncTime = 5
    if(guildCount > 0) rabbitmq.notify({cmd: 'guildCountUpdate', shardNum: SHARD_NUM, guildCount: guildCount })
    setTimeout(syncNumBotShards, syncTime * 1000)
  }catch(e){
    log.error(e)
    setTimeout(syncNumBotShards, 5000)
  }
}
CheckRabbitMQ()
