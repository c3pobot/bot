'use strict'
module.exports = async(obj, opt)=>{
  try{
    let msg2send = {content: 'You did not provide the correct information'}, id, guild, usr
    if(opt.find(x=>x.name == 'id')) id = opt.find(x=>x.name == 'id').value
    if(id){
      msg2send.content = 'Error finding channel **'+id+'**'
      const channel = await MSG.GetChannel(id)
      if(channel){
        if(channel.guild_id){
          guild = await MSG.GetGuild(channel.guild_id)
          if(guild && guild.owner_id) usr = await MSG.GetGuildMember(channel.guild_id, guild.owner_id)
        }
        const embedMsg = {
          color: 15844367,
          description: 'chId '+id+' info for C3PO\n```\n'
        }
        embedMsg.description += 'Guild Name   : '+(guild ? guild.name:'UNKONWN')+'\n'
        embedMsg.description += 'Guild ID     : '+(channel.guild_id ? channel.guild_id:'UNKNOWN')+'\n'
        embedMsg.description += 'Member Count : '+(guild ? guild.approximate_member_count:'UNKNOWN')+'\n'
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
        embedMsg.description += 'Channel Name : '+channel.name+'\n'
        embedMsg.description += 'Channel ID   : '+channel.id+'\n'
        embedMsg.description += 'catId        : '+(channel.parent_id ? channel.parent_id:'n/a')+'\n'
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
