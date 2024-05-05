'use strict'
module.exports = async(obj, opt)=>{
  try{
    let msg2send = {content: 'You did not provide the correct information'}, id, usr
    if(opt.find(x=>x.name == 'id')) id = opt.find(x=>x.name == 'id').value
    if(id){
      msg2send.content = 'Error getting guild info for **'+id+'**'
      const guild = await MSG.GetGuild(id)
      if(guild){
        if(guild.owner_id) usr = await MSG.GetGuildMember(id, guild.owner_id)
        const embedMsg = {
          color: 15844367,
          description: 'sId '+id+' info for C3PO\n```\n'
        }
        embedMsg.description += 'Guild Name   : '+guild.name+'\n'
        embedMsg.description += 'Guild ID     : '+guild.id+'\n'
        embedMsg.description += 'Member Count : '+guild.approximate_member_count+'\n'
        if(usr){
          if(usr.nick){
            embedMsg.description += 'Owner        : @'+usr.nick+'\n'
          }else{
            if(usr.user){
              embedMsg.description += 'Owner        : @'+(usr.user.username ? usr.user.username:'UNKNOWN')+'\n'
            }else{
              embedMsg.description += 'Owner        : @UNKNOWN\n'
            }
          }
        }
        embedMsg.description += 'Owner Tag    : @'+(usr && usr.user ? usr.user.username+'#'+usr.user.discriminator:'UNKNOWN')+'\n'
        embedMsg.description += '```'
        msg2send.content = null
        msg2send.embeds = [embedMsg]
      }
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
