'use strict'
const log = require('logger');
log.setLevel('debug');
const { Client, GatewayIntentBits } = require('discord.js');
const redis = require('redisclient');
const mongo = require('mongoclient');

const { startBot } = require('./bot')
const cmdQue = require('./cmdQue')
const saveSlashCmds = require('./saveSlashCmds')
const rabbitmq = require('./helpers/rabbitmq')
const fetch = require('./fetch')


const POD_NAME = process.env.POD_NAME || 'bot', NAME_SPACE = process.env.NAME_SPACE || 'default', SET_NAME = process.env.SET_NAME || 'bot'
let NODE_MONITOR_URL = process.env.NODE_MONITOR_URL || 'http://node-monitor.monitor:3000'

const checkRabbitmq = ()=>{
  try{
    log.debug(`${POD_NAME} checking rabbitmq status...`)
    if(rabbitmq?.ready){
      checkRedis()
      return
    }
    setTimeout(checkRabbitmq, 5000)
  }catch(e){
    log.error(e)
    setTimeout(checkRabbitmq, 5000)
  }
}
const checkRedis = ()=>{
  try{
    log.debug(`${POD_NAME} checking redis status...`)
    let status = redis.status()
    if(status){
      checkMongo()
      return
    }
    setTimeout(checkRedis, 5000)
  }catch(e){
    log.error(e)
    setTimeout(checkRedis, 5000)
  }
}
const checkMongo = async()=>{
  try{
    log.debug(`${POD_NAME} checking mongo status...`)
    let status = mongo.status()
    if(status){
      if(POD_NAME?.toString().endsWith("0")) saveSlashCmds('/app/src/cmds', 'bot')
      startCmdQue()
      return
    }
    setTimeout(checkMongo, 5000)
  }catch(e){
    log.error(e);
    setTimeout(checkMongo, 5000)
  }
}
const startCmdQue = () => {
  try{
    log.debug(`${POD_NAME} checking cmdQue status...`)
    let status = cmdQue.start()
    if(status == true){
      getReplicaCount()
      return
    }
    setTimeout(startCmdQue, 5000)
  }catch(e){
    log.error(e)
    setTimeout(startCmdQue, 5000)
  }
}
const getReplicaCount = async()=>{
  try{
    log.debug(`${POD_NAME} checking replica status...`)
    let data = await fetch(`${NODE_MONITOR_URL}/replicas/stateful/${NAME_SPACE}/${SET_NAME}`, null, 'GET')
    if(data?.replicas){
      startBot({ numShards: +data.replicas })
      require('./exchanges')
      return
    }
    setTimeout(getReplicaCount, 5000)
  }catch(e){
    log.error(e)
    setTimeout(getReplicaCount, 5000)
  }
}
checkRabbitmq()
