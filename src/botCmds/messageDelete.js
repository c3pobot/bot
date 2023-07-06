'use strict'
module.exports = async(msg, msgOpts, bot)=>{
  try{
    if(!msg.guild || msg.author.bot) return;
    if(!bot) return
    const info = msgOpts.message.find(x=>x.sId === msg?.guild?.id)
    if(!info.msgDelete) return;
    const channel = await bot?.channels?.fetch(info.msgDelete)
    if(!channel) return;
    const embedMsg = {
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
    const avatarURL = await msg.author.avatarURL({format: 'png', dynamic: true, size: 256})
    if(avatarURL){
      embedMsg.author.icon_url = avatarURL
      embedMsg.thumbnail = { url: avatarURL }
    }
    channel.send({embeds: [embedMsg]})
  }catch(e){
    throw(e);
  }
}
