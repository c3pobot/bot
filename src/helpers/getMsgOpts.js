'use strict'
const { mongo } = require('mongoapiclient')
const getBotSettings = require('./getBotSettings')
const updateVip = async()=>{
  try{
    let res = []
    let vip = await mongo.find('vip', {status: 1}, {_id: 1})
    let obj = getBotSettings()
    if(vip?.length > 0) res = vip.map(x=>x._id)
    if(obj?.boCR) res = res.concat(obj.boCR)
    return res;
  }catch(e){
    throw(e);
  }
}
const updateServers = async()=>{
  try{
    let res = {member: [], message: [], private: [], basic: []}
    let servers = await mongo.find('discordServer', {}, {instance: 1, _id: 1, basicStatus: 1, msgEdit: 1, msgDelete: 1, newMember: 1, memberLeave: 1, welcome: 1, welcomeAlt: 1})
    if(servers?.length > 0){
      res.basic = servers.filter(x=>x.basicStatus > 0).map(x=>x._id)
      res.member = servers.filter(x=>x.newMember || x.memberLeave || x.welcome || x.welcomeAlt).map(x=>{
        return Object.assign({}, {sId: x._id, newMember: x.newMember, memberLeave: x.memberLeave, welcome: x.welcome, welcomeAlt: x.welcomeAlt})
      })
      res.message = servers.filter(x=>x.msgEdit || x.msgDelete).map(x=>{
        return Object.assign({}, {sId: x._id, msgEdit: x.msgEdit, msgDelete: x.msgDelete})
      })
      res.private = servers.filter(x=>x.instance === 'private').map(x=>x._id)
    }
    return res;
  }catch(e){
    throw(e);
  }
}
module.exports = async()=>{
  try{
    let res = { private: [], basic: [], member: [], message: [], vip: [] }
    let vip = await updateVip()
    if(vip) res.vip = vip
    let servers = await updateServers()
    if(servers){
      res.member = servers.member || []
      res.message = servers.message || []
      res.private = servers.private || []
      res.basic = servers.basic || []
    }
    return res
  }catch(e){
    throw(e);
  }
}
