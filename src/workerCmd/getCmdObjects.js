'use strict'
const Cmds = {}
Cmds.getResolvedObj = (resolved)=>{
  if(!resolved) return
  let res = {}
  if(resolved.members) res.members = resolved.members.reduce((a,v) =>({...a, [v.id]:v}), {})
  if(resolved.users) res.users = resolved.users.reduce((a,v) =>({...a, [v.id]:v}), {})
  if(resolved.roles) res.roles = resolved.roles.reduce((a,v) =>({...a, [v.id]:v}), {})
  if(resolved.channels) res.channels = resolved.channels.reduce((a,v) =>({...a, [v.id]:v}), {})
  return res
}
Cmds.getMemberObj = (user, member)=>{
  if(!user || !member) return
  return {
    id: user.id,
    guildId: member.guildId,
    avatar: member.avatar,
    communication_disabled_until: member?.communicationDisabledUntilTimestamp,
    flags: member.flags,
    joined_at: member.joinedTimestamp,
    nick: member.nickname,
    display_name: member.displayName,
    pending: member?.pending,
    roles: member?.roles,
    avatar_url: member?.avatarURL,
    display_avatar_url: member?.displayAvatarURL,
    premium_since: member?.premiumSinceTimestamp,
    user: {
      id: user.id,
      avatar: user.avatar,
      avatar_decoration_data: user.avatarDecoration,
      avatar_url: user.avatarURL,
      bot: user?.bot,
      clan: user?.clan,
      created_timestamp: user.createdTimestamp,
      default_avatar_url: user.defaultAvatarURL,
      display_avatar_url: user.displayAvatarURL,
      discriminator: user.discriminator,
      global_name: user.globalName,
      flags: user.flags,
      tag: user.tag,
      username: user.username
    }
  }
}
Cmds.getChannelObj = (channel) =>{
  if(!channel) return
  return {
    id: channel.id,
    name: channel.name,
    guild_id: channel.guildId,
    last_message_id: channel.lastMessageId,
    nsfw: channel.nsfw,
    parent_id: channel.parentId,
    type: channel.type,
    flags: channel.flags,
    topic: channel.topic,
    rate_limit_per_user: channel.rateLimitPerUser,
    position: channel.rawPosition,
    botPerms: channel.permissionsFor(channel.guild?.members?.me)?.toArray()
  }
}
module.exports = Cmds
