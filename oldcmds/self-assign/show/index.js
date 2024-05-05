'use strict'
module.exports = async(obj = {})=>{
  try{
    let msg2send = {content: 'Error getting guild info'}, roles
    const guild = (await mongo.find('discordServer', {_id: obj.guild_id}, {selfassignroles: 1, }))[0]
    if(guild){
      msg2send.content = 'There are no self selfassignroles'
      if(guild.selfassignroles?.length > 0) roles = guild.selfassignroles
    }
    if(roles?.length > 0){
      msg2send.content = 'Server Self Assign Roles\n```autohotkey\n'
      for(let i in roles) msg2send.content += '@'+roles[i].name+'\n'
      msg2send.content += '```'
    }
    await HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.error(e);
    HP.ReplyError(obj)
  }
}
