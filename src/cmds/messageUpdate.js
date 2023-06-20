'use strict'
const TruncateStr = (str, num)=>{
  try{
    if(str.length <= num){
      return str
    }else{
      return str.slice(0, num) + '...'
    }
  }catch(e){
    console.error(e)
  }
}
module.exports = async(obj = {}, msgOpts)=>{
  try{
    if(!obj.newMsg || !obj.oldMsg || obj.newMsg?.author?.bot || !obj.newMsg?.guild) return;
    const info = msgOpts.message?.find(x=>x.sId === obj.newMsg?.guild?.id)
    if(!info?.msgEdit) return;
    const channel = await bot.channels.fetch(info.msgEdit)
    if(!channel) return;
    const embedMsg = {
      color: 15844367,
      author: {
        name: oldMsg.author.tag
      },
      description: 'Message edited in <#'+obj.oldMsg.channelId+'> [Jump to Message](https://discord.com/channels/'+obj.oldMsg.guildId+'/'+obj.oldMsg.channelId+'/'+obj.oldMsg.id+')\n\n**Before**\n'+TruncateStr(obj.oldMsg.content, 2000)+'\n\n**After**\n'+TruncateStr(obj.newMsg.content, 2000),
      footer:{
        text: 'Author: '+obj.oldMsg.author.id+'| Message ID: '+obj.oldMsg.id
      },
      timestamp: new Date()
    }
    const avatarURL = await obj.oldMsg.author.avatarURL({format: 'png', dynamic: true, size: 256})
    if(avatarURL){
      embedMsg.author.icon_url = avatarURL
      embedMsg.thumbnail = { url: avatarURL }
    }
    channel.send({embeds: [embedMsg]})
  }catch(e){
    console.error(e);
  }
}
