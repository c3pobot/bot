'use strict'
const mongo = require('mongoclient')
const getPotPerms = require('src/helpers/getBotPerms')
const showListOfRoles = require('./showListOfRoles')
const { checkIsUser, getBotPerms, replyButton } = require('src/helpers')

module.exports = async(obj, data = {})=>{
  if(obj.customId){
    let auth = checkIsUser(obj)
    if(!auth) return
    await replyButton(obj)
  }

  let botPerms = getBotPerms(obj)
  if(!botPerms || botPerms?.length == 0) return { content: 'Error getting permissions for the bot...'}

  if(botPerms?.filter(x=>x === 'ManageRoles').length == 0) return { content: 'The bot does not have permission to assign roles to members...' }

  let roleId = data.roleId || obj?.options?.get('role')?.value
  let server = (await mongo.find('discordServer', { _id: obj.guildId }, { selfassignroles: 1 }))[0]

  if(!server?.selfassignroles || server?.selfassignroles?.length == 0) return { content: 'there are no self assign roles' }

  if(!roleId) return showListOfRoles(obj, server.selfassignroles)

  let role = await obj.guild.roles.fetch(roleId)
  if(!role) return { content: `error finding role..`}

  if(server?.selfassignroles?.filter(x=>x.id === roleId).length == 0) return { content: `\`@${role.name}\` is not a self assign role...`}

  obj.member?.roles?.add(roleId)
  return { content: `You have been assigned the \`@${role.name}\` role...`, components: [] }
}
