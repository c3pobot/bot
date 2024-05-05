'use strict'
const log = require('logger')
const mongo = require('mongoapiclient')
const { botSettings } = require('./botSettings')
let msgOpts = { private: new Set([]), basic: new Set([]), member: [], message: [], vip: new Set([]) }
const updateVip = async()=>{
  let res = []
  let vip = await mongo.find('vip', {status: 1}, {_id: 1})
  if(vip?.length > 0 && vip[0]) res = vip.map(x=>x._id)
  if(botSettings?.boCR) res = res.concat(obj.boCR)
  msgOpts.vip = new Set(res);
}
const updateServers = async()=>{
  let servers = await mongo.find('discordServer', {}, {instance: 1, _id: 1, basicStatus: 1, msgEdit: 1, msgDelete: 1, newMember: 1, memberLeave: 1, welcome: 1, welcomeAlt: 1})
  if(!servers || servers?.length == 0) return
  msgOpts.basic = new Set(servers.filter(x=>x.basicStatus > 0).map(x=>x._id) || [])
  msgOpts.private = new Set(servers.filter(x=>x.instance === 'private').map(x=>x._id) || [])
  msgOpts.member = servers.filter(x=>x.newMember || x.memberLeave || x.welcome || x.welcomeAlt).map(x=>{
    return Object.assign({}, {sId: x._id, newMember: x.newMember, memberLeave: x.memberLeave, welcome: x.welcome, welcomeAlt: x.welcomeAlt})
  })
  msgOpts.message = servers.filter(x=>x.msgEdit || x.msgDelete).map(x=>{
    return Object.assign({}, {sId: x._id, msgEdit: x.msgEdit, msgDelete: x.msgDelete})
  })
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
const start = ()=>{
  try{
    let status = mongo.status()
    if(status){
      update(true)
      return
    }
    setTimeout(start, 5000)
  }catch(e){
    log.error(e)
    setTimeout(start, 5000)
  }
}
start()
module.exports = { msgOpts }
