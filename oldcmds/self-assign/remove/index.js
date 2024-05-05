'use strict'
const ShowListOfRoles = require('./showListOfRoles')
module.exports = async(obj = {}, opt = [])=>{
  try{
    let msg2send = {content: 'This command requires bot admin'}, roleId, role, roles = []
    let auth = await HP.CheckServerAdmin(obj)
    if(!auth){
      await HP.ReplyMsg(obj)
      return;
    }
    if(obj.confirm?.roleId){
      await HP.ReplyButton(obj)
      roleId = obj.confirm.roleId
    }
    if(!roleId) roleId = await HP.GetOptValue(opt, 'role')
    msg2send.content = 'Error getting server info'
    let guild = (await mongo.find('discordServer', {_id: obj.guild_id}, {selfassignroles: 1}))[0]
    if(guild?.selfassignroles) roles = guild.selfassignroles
    if(roles?.length === 0) msg2send.content = 'There are no self assign roles'
    if(roles?.length > 0 && !roleId){
      await ShowListOfRoles(obj, roles)
      return;
    }
    if(roleId && roles?.length > 0){
      msg2send.content = 'That is not a self assign role'
      role = roles.find(x=>x.id === roleId)
    }
    if(role){
      await mongo.set('discordServer', {_id: obj.guild_id}, {selfassignroles: roles.filter(x=>x.id != roleId)})
      msg2send.content = '**@'+role.name+'** was removed as a self assign role'
    }
    await HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.error(e);
    HP.ReplyError(obj)
  }
}
