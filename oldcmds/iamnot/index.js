'use strict'
'use strict'
const ShowListOfRoles = require('./showListOfRoles')
module.exports = async(obj = {})=>{
  try{
    let msg2send = {content: 'Error finding your discord Id'}, roleId, roleName, botPerms, hasRolePerm, guild
    let dId = obj.member?.user?.id
    if(obj.confirm?.roleId){
      await HP.ReplyButton(obj)
      roleId = obj.confirm.roleId
    }
    if(!roleId) roleId = await HP.GetOptValue(obj.data?.options, 'role')
    if(dId){
      msg2send.content = 'There are no self assign roles'
      guild = (await mongo.find('discordServer', {_id: obj.guild_id}, {selfassignroles: 1}))[0]
    }
    if(guild?.selfassignroles?.length > 0 && !roleId){
      await ShowListOfRoles(obj, guild.selfassignroles)
      return;
    }
    if(!roleId) msg2send.content = 'No role was provided'
    if(roleId){
      msg2send.content = 'Error getting role info'
      const role = await HP.BotRequest('getRole', {sId: obj.guild_id, roleId: roleId})
      if(role) roleName = role.name
    }
    if(guild?.selfassignroles?.length > 0 && roleId && roleName){
      msg2send.content = 'The **@'+roleName+'** is not a self assign role'
      if(guild.selfassignroles.filter(x=>x.id === roleId).length > 0){
        msg2send.content = 'Error getting permissions info for the bot'
        botPerms = await HP.BotRequest('getGuildMember', {sId: obj.guild_id, dId: process.env.DISCORD_CLIENT_ID})
      }
    }
    if(botPerms?.perms){
      msg2send.content = 'The bot does not have permission to remove roles from users'
      if(botPerms.perms.filter(x=>x === 'MANAGE_ROLES').length > 0) hasRolePerm = true
    }
    if(hasRolePerm){
      msg2send.content = 'Error removing the **@'+roleName+'** role'
      const status = await MSG.GuildMemberRoleRemove(obj.guild_id, dId, roleId)
      if(status > 0) msg2send.content = '**@'+roleName+'** has been removed as a role'
    }
    await HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.error(e);
  }
}
