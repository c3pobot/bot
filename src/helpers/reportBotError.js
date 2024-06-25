'use strict'
const mongo = require('mongoclient')
const log = require('logger')
const cmdQue = require('src/cmdQue')
const POD_NAME = process.env.POD_NAME

const blackListGuild = (obj, msg, type)=>{
  if(!msg?.toLowerCase()?.includes('unknown')) return
  delete obj.msg
  obj.type = type
  if(msg?.toLowerCase()?.includes('channel') && obj.chId){
    mongo.set('blackList', {_id: obj.chId }, obj)
    cmdQue.add('discord', { cmd: 'admin-report', msg: { content: `bot blackListed channel ${obj.chId} in server ${obj.sId} for type ${type}`} })
  }
  if(msg?.toLowerCase()?.includes('message') && obj.msgId){
    mongo.set('blackList', {_id: obj.msgId }, obj)
    cmdQue.add('discord', { cmd: 'admin-report', msg: { content: `bot blackListed message ${obj.msgId} in channel ${obj.chId} in server ${obj.sId} for type ${type}`} })
  }

}
const blackListUser = (obj, msg, type)=>{
  if(!msg || !msg?.toLowerCase()?.includes('cannot send messages to this user')) return
  delete obj.msg
  obj.type = type
  if(obj.dId){
    mongo.set('blackList', { _id: obj.dId }, { dId: obj.dId, sId: obj.sId, shardId: obj.shardId })
    cmdQue.add('discord', { cmd: 'admin-report', msg: { content: `bot blackListed user ${obj.dId} in server ${obj.sId} for type ${type}`} })
  }
}
module.exports = (obj = {}, err)=>{
  if(obj.cmd){
    let type
    if(obj.shardId) type = 'shard'
    if(obj.guildId) type = 'guild'
    if(obj.patreonId) type = 'arena'
    let str = `${POD_NAME} ${obj.cmd}`
    if(type) str += ` ${type}`
    if(obj.sId) str += ` sId: ${obj.sId}`
    if(obj.dId) str += ` dId: ${obj.dId}`
    if(obj.chId) str += ` ch: ${obj.chId}`
    if(obj.msgId) str += ` msg: ${obj.msgId}`
    if(err?.message){
      blackListGuild(JSON.parse(JSON.stringify(obj)), err.message, type)
      blackListUser(JSON.parse(JSON.stringify(obj)), err.message, type)
      str += ` ${err.message}`
    }else{
      if(err) str += ` ${err}`
    }
    log.debug(str)
    return
  }
  if(err?.message){
    log.error(err.message)
    return
  }
  if(err) log.error(err)
}
