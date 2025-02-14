'use strict'
module.exports = (obj, member)=>{
  let avatarURL = member?.avatarURL({format: 'png', dynamic: true, size: 256 }) || member?.user?.avatarURL({format: 'png', dynamic: true, size: 256 })

  let username = member.nickname || member.displayName
  let embedMsg = {
    author: { name: `@${username}`, icon_url: avatarURL },
    color: 15844367,
    image: { url: avatarURL },
    footer: { text: `ID: ${member?.id}` },
    timestamp: new Date()
  }
  return { content: null, embeds: [embedMsg] }
}
