'use strict'
const mongo = require('mongoclient')
const showListOfRoles = require('./showListOfRoles')
const { checkIsUser, getBotPerms, replyButton } = require('src/helpers')

module.exports = async(obj, opt = {})=>{
  let roleId = opt.roleId || obj.options?.get('role')?.value
  let server = (await mongo.find('discordServer', { _id: obj.guildId }, { selfassignroles: 1 }))[0]
  if(!server?.selfassignroles || server?.selfassignroles?.length == 0) return { content: 'There are not self assign roles..', components: [] }

  if(!roleId) return showListOfRoles(obj, server.selfassignroles)

  let role = obj.guild.roles.cache.get(roleId)
  if(!role) return { content: 'that is not a valid role...', components: [] }

  if(server?.selfassignroles?.filter(x=>x.id === roleId).length == 0) return { content: `\`@${role.name}\` is not a self assign role..`, components: [] }

  await mongo.set('discordServer', { _id: obj.guildId }, { selfassignroles: server.selfassignroles.filter(x=>x.id !== roleId) })
  return { content: `\`@${role.name}\` has been removed as a self assign role...`, components: [] }
}
