'use strict'
const mongo = require('mongoclient')
const { getBotPerms } = require('src/helpers')

module.exports = async(obj)=>{
  if(!obj) return
  let botPerms = getBotPerms(obj)
  if(!botPerms || botPerms?.length == 0) return { content: 'Error getting permissions for the bot...'}
  if(botPerms?.filter(x=>x === 'ManageRoles').length == 0) return { content: 'The bot does not have permission to assign roles to members...' }

  let roleId = obj.options?.get('role').value
  if(!roleId) return { content: 'you did not specify a role...'}

  let role = obj.guild?.roles.cache?.get(roleId)
  if(!role) return { content: 'that is not a valid role...'}
  if(role.name == '@everyone') return { content: 'You cannot set the **everyone** role as self assign role' }

  let server = (await mongo.find('discordServer', { _id: obj.guildId }, { selfassignroles: 1}))[0]
  let roles = server?.selfassignroles || []
  if(roles?.filter(x=>x.id === roleId).length > 0) return { content: `\`@${role.name}\` is alread a self assign role...`}

  roles.push({ id: role.id, name: role.name })
  await mongo.set('discordServer', { _id: obj.guildId }, { selfassignroles: roles })
  return { content: `\`@${role.name}\` was added as a self assign role...`}
}
