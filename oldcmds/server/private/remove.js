'use strict'
module.exports = async(obj, opt)=>{
  try{
    let msg2send = {content: 'Error finding that server'}, sId = obj.guild_id
    if(opt && opt.find(x=>x.name == 'id')) sId = opt.find(x=>x.name == 'id').value
    if(sId){
      msg2send.content = 'Error finding guild **'+sId+'**'
      const guild = await MSG.GetGuild(sId)
      if(guild && guild.name){
        await mongo.unset('discordServer', {_id: sId}, {instance: 'private'})
        const tempObj = await mongo.find('discordServer', {instance: 'private'}, {_id: 1})
        if(tempObj){
          const tempSvr = tempObj.map(x=>x._id)
          await redis.set('privateServers', tempSvr)
        }
        msg2send.content = guild.name+' was removed from the private server list'
      }
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
