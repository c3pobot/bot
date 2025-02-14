'use strict'
const log = require('logger')
const { cmdMap } = require('../cmdMap')
const { botSettings } = require('src/helpers/botSettings')
const { msgOpts } = require('src/helpers/msgOpts')
const { dataList } = require('src/helpers/dataList')
const Cmds = {}

Cmds['setLogLevel'] = (data = {})=>{
  try{
    if(data?.logLevel){
      log.setLevel(data?.logLevel);
    }else{
      log.setLevel('info');
    }
  }catch(e){
    log.error(e)
  }
}
Cmds.cmdMapNotify = ({ data })=>{
  if(!data) return
  for(let i in data) cmdMap[i] = data[i]
  log.debug(`updated cmdMap`)
}
Cmds.botSettingsNotify = ({ data })=>{
  if(!data) return
  for(let i in data) botSettings[i] = data
  log.debug(`updated botSettings`)
}
Cmds.msgOptsNotify = ({ data })=>{
  if(!data?.vip || !data?.private) return
  msgOpts.vip = new Set(data.vip || [])
  msgOpts.private = new Set(data.private || [])
  log.debug(`updated msgOpts`)
}
Cmds.autoCompleteNotify = ({ data })=>{
  if(!data?.nameKeys) return
  dataList.nameKeys = data.nameKeys
  dataList.autoObj = data.autoObj
  if(dataList.gameVersion !== data.gameVersion){
    dataList.gameVersion = data.gameVersion
    log.info(`updated dataList to ${dataList.gameVersion}...`)
  }
  log.debug(`updated dataList`)
}
module.exports = (data)=>{
  try{
    if(!data) return
    if(Cmds[data?.routingKey]) Cmds[data.routingKey](data)
    if(Cmds[data?.cmd]) Cmds[data.cmd](data)
  }catch(e){
    log.error(e)
  }
}
