'use strict'
const mongo = require('mongoclient')
module.exports = async(obj)=>{
  if(!obj) return
  let server = (await mongo.find('discordServer', { _id: obj.guildId }, { admin: 1 }))[0]
  if(!server?.admin  || server?.admin?.length == 0) return
  for(let i in server.admin){
    if(obj.member?.roles?.cache?.has(server.admin[i]?.id)) return true
  }
}
