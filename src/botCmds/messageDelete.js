'use strict'
const { msgOpts } = require('src/helpers/msgOpts')
module.exports = async(msg, bot)=>{
  if(!msg || !bot || !msg.guild || msg.author.bot) return;

  let info = msgOpts?.message?.get(msg?.guild?.id)
  if(!info?.msgDelete) return;

  let channel = await bot?.channels?.fetch(info.msgDelete)
  if(!channel) return;

  let embedMsg = {
    color: 15844367,
    author: {
      name: msg.author.tag
    },
    description: 'Message sent by <@'+msg.author.id+'> deleted in <#'+msg.channelId+'>\n'+msg.content,
    footer:{
      text: 'Author: '+msg.author.id+'| Message ID: '+msg.id
    },
    timestamp: new Date()
  }
  let avatarURL = await msg.author.avatarURL({format: 'png', dynamic: true, size: 256})
  if(avatarURL){
    embedMsg.author.icon_url = avatarURL
    embedMsg.thumbnail = { url: avatarURL }
  }
  channel.send({embeds: [embedMsg]})
}
