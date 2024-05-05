'use strict'
const getBotPerms = async(channel)=>{
  if(channel?.guild?.members?.me) return await channel.permissionsFor(channel.guild.members.me).toArray()
}
module.exports = async(msg, cmdType = 'reaction')=>{
  try{
    if(!msg?.id) return;
    let botPerms = await GetBotPerms(msg.channel)
    let usr = msg.guild.members.cache.get(msg.author.id)
    let res = {
      id: msg.id+'-'+cmdType.charAt(0)+'-'+timeNow,
      type: cmdType,
      shard: msg.guild.shardId,
      msgId: msg.id,
      sId: msg.guild.id,
      dId: msg.author.id,
      chId: msg.channel.id,
      channelName: msg.channel.name,
      catId: msg.channel.parentID,
      nsfw: msg.channel.nsfw,
      guildOwnerId: (msg.guild.ownerID ? msg.guild.ownerID:null),
      guildOwner: (msg.guild.owner ? msg.guild.owner.displayName:null),
      guildName: msg.guild.name,
      username: (usr?.displayName ? usr?.displayName:msg.author.username),
      perms: (botPerms ? botPerms:[]),
      reference: msg.reference,
      content: msg.content,
      guildPerms: msg?.channel?.guild?.me?.permissions?.toArray(),
    }
    res.avatarURL = await msg.author.avatarURL({format: 'png', dynamic: true, size: 256})
    if(msg.member.roles.cache.size > 0) res.roles = msg.member.roles.cache.map(r=>{
      return Object.assign({}, {
        id: r.id,
        name: r.name,
        perms: r.permissions.toArray()
      })
    }).filter(x=>x.name != '@everyone')
    if(msg.mentions.members.size > 0) res.musers = msg.mentions.members.map(m=>{
      return Object.assign({}, {
        id: m.user.id,
        roles: m._roles,
        tag: m.user.tag,
        username: m.nickname ? m.nickname:m.user.username,
        joinedTimestamp: m.joinedTimestamp,
        createdTimestamp: m.user.createdTimestamp,
        avatarURL: m.user.avatarURL({format: 'png', dynamic: true, size: 256})
      })
    })
    if(msg.mentions.roles.size > 0) res.mroles = msg.mentions.roles.map(r=>{
      return Object.assign({}, {
        id: r.id,
        name: r.name
      })
    })
    if(msg.mentions.channels.size > 0) res.mchannels = msg.mentions.channels.map(c=>{
      return Object.assign({}, {
        id: c.id,
        name: c.name,
        nsfw: c.nsfw
      })
    })
    return res
  }catch(e){
    throw(e);
  }
}
