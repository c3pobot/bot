'use strict'
const log = require('logger')
module.exports = (obj = {})=>{
  try{
    let member = obj.member?.toJSON()
    let user = obj.user?.toJSON()
    let data = {
      app_permissions: obj.appPermissions,
      application_id: obj.applicationId,
      channel: {
        flags: obj.channel?.flags,
        type: obj.channel?.type,
        guild_id: obj.channel?.guildId,
        id: obj.channel?.id,
        last_message_id: obj.channel?.lastMessageId,
        last_pin_timestamp: obj.channel?.lastPinTimestamp,
        name: obj.channel?.name,
        nsfw: obj.channel?.nsfw,
        parent_id: obj.channel?.parentId,
        position: obj.channel?.rawPosition,
        rate_limit_per_user: obj.channel?.rateLimitPerUser,
        topic: obj?.channel?.topic
      },
      channel_id: obj.channelId,
      data: {
        guild_id: obj.commandGuildId,
        id: obj.commandId,
        name: obj.commandName,
        options: obj.options?.data,
        resolved: {
          members: obj.options?.resolved?.members?.reduce((a,v) =>({...a, [v.userId]:v}), {}),
          users: obj.options?.resolved?.users?.reduce((a,v) =>({...a, [v.id]:v}), {}),
          roles: obj.options?.resolved?.roles?.reduce((a,v) =>({...a, [v.id]:v}), {})
        },

        type: obj.commandType,
        resolvedjs: obj.options?.resolved
      },
      guild: {
        id: obj.guild?.id
      },
      guild_id: obj.guildId,
      id: obj.id,
      member: {
        avatar: member?.avatar,
        avatarURL: member?.avatarURL,
        displayAvatarURL: member?.displayAvatarURL,
        communications_disabled_until: member?.communicationDisabledUntilTimestamp,
        deaf: false,
        flags: member?.flags,
        joined_at: member?.joinedTimestamp,
        mute: false,
        nick: member?.nickname,
        pending: member?.pending,
        premissions: obj.memberPermissions,
        premium_since: member?.premiumSinceTimesamp,
        roles: member?.roles,
        unusual_dm_activity_until: null,
        user: {
          bot: user?.bot,
          avatar: user?.avatar,
          avatarURL: user?.avatarURL,
          displayAvatarURL: user?.displayAvatarURL,
          avatar_decoration_data: user?.avatarDecoration,
          discriminator: user?.discriminator,
          global_name: user?.globalName,
          id: user?.id,
          public_flags: user?.flags,
          username: user?.username
        },
      },
      token: obj.token,
      type: obj.type,
      version: obj.version,
      createdTimestamp: obj.createdTimestamp,
      message: obj.message?.toJSON()
    }
    return data
  }catch(e){
    log.error(e)
  }
}
