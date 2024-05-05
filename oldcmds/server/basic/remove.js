'use strict'
module.exports = async(obj, opt)=>{
  try{
    let msg2send = {content: 'Error finding that server'}, sId = obj.guild_id
    if(opt && opt.find(x=>x.name == 'id')) sId = opt.find(x=>x.name == 'id').value
    if(sId){
      msg2send.content = 'Error finding guild **'+sId+'**'
      const guild = await MSG.GetGuild(sId)
      if(guild && guild.name){
        await mongo.set('discordServer', {_id: sId}, {basicStatus: 0})
        basicCmdAllowedServers = basicCmdAllowedServers.filter(x=>x != sId)
        await HP.DelBasicSlashCMDS(sId)
        msg2send.content = guild.name+' was disabled from usage of bot basic commands'
      }
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
