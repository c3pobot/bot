'use strict'
const log = require('logger')
const mongo = require('mongoclient')
let botSettings = { }, mongoReady = mongo.status(), notify = true, logDebug = false
const getSettings = async()=>{
  let data = (await mongo.find('botSettings', {_id: "1"}, {_id: 0, TTL: 0}))[0]
  if(!data) return
  for(let i in data) botSettings[i] = data[i]
  botSettings.ready = true
  if(botSettings?.debug && !logDebug){
    log.setLevel('debug')
    logDebug = true
    log.info(`set bot log level to debug...`)
  }
  if(logDebug && !botSettings?.debug){
    log.setLevel('info')
    logDebug = false
    log.info(`set bot log level to info...`)
  }
  if(notify){
    notify = false
    log.info(`updated botSettings...`)
  }
  return true
}
const update = async()=>{
  try{
    let syncTime = 5, status
    if(!mongoReady) mongoReady = mongo.status()
    if(mongoReady) status = await getSettings()
    if(status) syncTime = 60
    setTimeout(update, syncTime * 1000)
  }catch(e){
    log.error(e)
    setTimeout(update, 5000)
  }
}
update()
module.exports = { botSettings }
