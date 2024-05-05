'use strict'
const { msgOpts } = require('src/helpers/msgOpts')
module.exports = async(member, bot)=>{
  let info = msgOpts.member.find(x=>x.sId === member?.guild?.id)
  if(!info?.memberLeave || !bot) return;

  let channel = await bot.channels.fetch(info.memberLeave)
  if(!channel) return;

  let embedMsg = {
    color: 15844367,
    author: {
      name: 'Member Left'
    },
    description: '<@'+member.user.id+'> '+member.user.tag,
    footer:{
      text: 'ID: '+member.user.id
    },
    timestamp: new Date()
  }
  let avatarURL = await member.user.avatarURL({format: 'png', dynamic: true, size: 256})
  if(avatarURL){
    embedMsg.author.icon_url = avatarURL
    embedMsg.thumbnail = { url: avatarURL }
  }
  for(let i in member?.roles?.cache){
    if(member?.roles?.cache[i]?.id){
      if(member?.roles?.cache[i].name !== '@everyone') embedMsg.description += '<@&'+member?.roles?.cache[i].id+'> '
    }
  }
  channel.send({embeds: [embedMsg]})
}
