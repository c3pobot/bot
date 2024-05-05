'use strict'
const mongo = require('mongoclient')

module.exports = async(obj)=>{
  let server = (await mongo.find('discordServer', { _id: obj.guildId }, { selfassignroles: 1 }))[0]
  if(!server?.selfassignroles || server?.selfassignroles?.length == 0) return { content: 'there are no self assign roles...' }

  let msg2send = 'Server Self Assign Roles\n```autohotkey\n'
  for(let i in server.selfassignroles){
    let role = obj.guild?.roles?.cache?.get(server.selfassignroles[i].id)
    msg2send += `@${role.name}\n`
  }
  msg2send += '```'
  return { content: msg2send }
}
