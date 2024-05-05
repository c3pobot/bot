'use strict'
const { msgOpts } = require('src/helpers/msgOpts')
const truncateStr = (str, num)=>{
  if(str.length <= num){
    return str
  }else{
    return str.slice(0, num) + '...'
  }
}
module.exports = async(obj = {}, bot)=>{
  if(!obj.newMsg || !obj.oldMsg || obj.newMsg?.author?.bot || !obj.newMsg?.guild) return;
  let info = msgOpts.message?.find(x=>x.sId === obj.newMsg?.guild?.id)
  if(!info?.msgEdit) return;
  if(!bot) return
  let channel = await bot.channels.fetch(info.msgEdit)
  if(!channel) return;
  let embedMsg = {
    color: 15844367,
    author: {
      name: oldMsg.author.tag
    },
    description: 'Message edited in <#'+obj.oldMsg.channelId+'> [Jump to Message](https://discord.com/channels/'+obj.oldMsg.guildId+'/'+obj.oldMsg.channelId+'/'+obj.oldMsg.id+')\n\n**Before**\n'+truncateStr(obj.oldMsg.content, 2000)+'\n\n**After**\n'+truncateStr(obj.newMsg.content, 2000),
    footer:{
      text: 'Author: '+obj.oldMsg.author.id+'| Message ID: '+obj.oldMsg.id
    },
    timestamp: new Date()
  }
  let avatarURL = await obj.oldMsg.author.avatarURL({format: 'png', dynamic: true, size: 256})
  if(avatarURL){
    embedMsg.author.icon_url = avatarURL
    embedMsg.thumbnail = { url: avatarURL }
  }
  channel.send({embeds: [embedMsg]})
}
