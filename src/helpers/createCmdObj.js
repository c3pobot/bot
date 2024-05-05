'use strict'
const getBotPerms = async(channel)=>{
  if(channel?.guild?.members?.me) return await channel.permissionsFor(channel.guild.members.me).toArray()
}
module.exports = async(msg, type = 'reaction')=>{
  if(!msg) return
  let botPerms = await GetBotPerms(msg.channel)
  let res = {
    id: msg.id,
    guild_id: msg.guild?.id,
    member: {
      id: msg.author.id
    },
    data: {
      name: type
    },
    channel_id: msg.channel?.id,
    reference: msg.reference,
    perms: botPerms || [],
    content: msg.content,
    timestamp: Date.now()
  }
  return res
}
