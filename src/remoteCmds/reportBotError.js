'use strict'
const mongo = require('mongoclient')
const log = require('logger')
const POD_NAME = process.env.POD_NAME

const blackList = (obj, type)=>{
  if(!type?.toLowerCase()?.includes('unknown')) return
  if(type?.toLowerCase()?.includes('channel') && obj.chId) mongo.set('blackList', {_id: obj.chId })
  if(type?.toLowerCase()?.includes('message') && obj.msgId) mongo.set('blackList', {_id: obj.msgId })
}
module.exports = (obj = {}, err)=>{
  if(obj.cmd){
    let type = 'arena'
    if(obj.shardId) type = 'shard'
    let str = `${POD_NAME} ${type} ${obj.cmd} ${obj.chId}`
    if(obj.msgId) str += ` ${obj.msgId}`
    if(err?.message){
      blackList(obj, err.message)
      str += ` ${err.message}`
    }else{
      if(err) str += ` ${err}`
    }
    log.debug(str)
    return
  }
  if(err?.message){
    log.debug(err.message)
    return
  }
  if(err) log.error(err)
}
