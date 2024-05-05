'use strict'
module.exports = (user, member)=>{
  if(!user || !member) return
  return {
    id: value,
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
      id: user?.id,
      avatar: user?.avatar,
      avatar_decoration_data: user?.avatarDecoration,
      avatar_url: user?.avatarURL,
      bot: user?.bot,
      clan: user?.clan,
      created_timestamp: user?.createdTimestamp,
      default_avatar_url: user?.defaultAvatarURL,
      display_avatar_url: user?.displayAvatarURL,
      discriminator: user?.discriminator,
      global_name: user?.globalName,
      flags: user?.flags,
      tag: user?.tag,
      username: user?.username
    }
  }
}
