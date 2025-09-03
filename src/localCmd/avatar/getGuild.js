'use strict'
module.exports = (obj, sId)=>{

  if(sId === 'this') sId = obj.guildId
  if(!sId) return { content: 'Server id or this not provided' }
  let guild = obj?.client?.guilds?.cache?.get(sId)
  if(!guild) return { content: `error getting guild for **${sId}**`}
  let avatarURL = guild.iconURL({format: 'png', dynamic: true, size: 256})
  let embedMsg = {
    author: { name: guild.name, icon_url: avatarURL },
    color: 15844367,
    image: { url: avatarURL },
    footer: { text: `ID: ${sId}` },
    timestamp: new Date()
  }
  return { content: null, embeds: [embedMsg] }
}
