'use strict'
const log = require('logger')
const mongo = require('mongoapiclient')
const { botSettings } = require('./botSettings')
let msgOpts = { private: [], basic: [], member: [], message: [], vip: [] }
const updateVip = async()=>{
  try{
    let res = []
    let vip = await mongo.find('vip', {status: 1}, {_id: 1})
    if(vip?.length > 0) res = vip.map(x=>x._id)
    if(botSettings?.map?.boCR) res = res.concat(obj.boCR)
    msgOpts.vip = res;
  }catch(e){
    throw(e);
  }
}
const updateServers = async()=>{
  try{
    let servers = await mongo.find('discordServer', {}, {instance: 1, _id: 1, basicStatus: 1, msgEdit: 1, msgDelete: 1, newMember: 1, memberLeave: 1, welcome: 1, welcomeAlt: 1})
    if(servers?.length > 0){
      msgOpts.basic = servers.filter(x=>x.basicStatus > 0).map(x=>x._id)
      msgOpts.member = servers.filter(x=>x.newMember || x.memberLeave || x.welcome || x.welcomeAlt).map(x=>{
        return Object.assign({}, {sId: x._id, newMember: x.newMember, memberLeave: x.memberLeave, welcome: x.welcome, welcomeAlt: x.welcomeAlt})
      })
      msgOpts.message = servers.filter(x=>x.msgEdit || x.msgDelete).map(x=>{
        return Object.assign({}, {sId: x._id, msgEdit: x.msgEdit, msgDelete: x.msgDelete})
      })
      msgOpts.private = servers.filter(x=>x.instance === 'private').map(x=>x._id)
    }
  }catch(e){
    throw(e);
  }
}
const update = async(notify = false)=>{
  try{
    await updateVip()
    await updateServers()
    if(notify) log.info('msgOpts updated...')
    setTimeout(update, 60000)
  }catch(e){
    log.error(e);
    setTimeout(()=>update(notify), 5000)
  }
}
update(true)
module.exports = { msgOpts }
