'use strict'
const updateVip = async()=>{
  try{
    let res = []
    const vip = await mongo.find('vip', {status: 1}, {_id: 1})
    const obj = (await mongo.find('botSettings', {_id: "1"}))[0]
    if(vip?.length > 0) res = vip.map(x=>x._id)
    if(obj?.boCR) res = res.concat(obj.boCR)
    return res;
  }catch(e){
    console.error(e);
  }
}
const updateServers = async()=>{
  try{
    const res = {member: [], message: [], private: [], basic: []}
    const servers = await mongo.find('discordServer', {}, {instance: 1, _id: 1, basicStatus: 1, msgEdit: 1, msgDelete: 1, newMember: 1, memberLeave: 1, welcome: 1, welcomeAlt: 1})
    const guilds = (await mongo.find('botSettings', {_id: "2"}))[0]
    if(guilds?.privateServers) res.private = guilds?.privateServers
    if(servers?.length > 0){
      res.basic = servers.filter(x=>x.basicStatus > 0).map(x=>x._id)
      res.member = servers.filter(x=>x.newMember || x.memberLeave || x.welcome || x.welcomeAlt).map(x=>{
        return Object.assign({}, {sId: x._id, newMember: x.newMember, memberLeave: x.memberLeave, welcome: x.welcome, welcomeAlt: x.welcomeAlt})
      })
      res.message = servers.filter(x=>x.msgEdit || x.msgDelete).map(x=>{
        return Object.assign({}, {sId: x._id, msgEdit: x.msgEdit, msgDelete: x.msgDelete})
      })
    }
    return res;
  }catch(e){
    console.error(e);
  }
}
module.exports = async(mongoReady = 0)=>{
  try{
    const res = { private: [], basic: [], member: [], message: [], vip: [] }
    if(mongoReady){
      const vip = await updateVip()
      if(vip) res.vip = vip
      const servers = await updateServers()
      if(servers){
        res.member = servers.member || []
        res.message = servers.message || []
        res.private = servers.private || []
        res.basic = servers.basic || []
      }
    }
    return res
  }catch(e){
    console.error(e);
  }
}
