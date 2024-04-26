'use strict'
module.exports = (obj = {})=>{
  let data = {
    id: obj.id,
    app_permissions: obj.appPermissions,
    application_id: obj.applicationId,
    channel: obj.channel?.toJSON(),
    channel_id: obj.channel?.id,
    data: {
      id: obj.commandId,
      name: obj.commandName,
      options: obj.options?.data,
      resolved: {
        members: obj.options?.resolved?.members?.reduce((a,v) =>({...a, [v.userId]:v}), {}),
        users: obj.options?.resolved?.users?.reduce((a,v) =>({...a, [v.id]:v}), {}),
        roles: obj.options?.resolved?.roles?.reduce((a,v) =>({...a, [v.id]:v}), {})
      },
      type: obj.commandType
    },
    guild: obj.guild?.toJSON(),
    guild_id: obj.guild?.id,
    member: obj.member?.toJSON(),
    token: obj.token,
    type: obj.type,
    version: obj.version,
    message: obj.message?.toJSON()
  }
  return data
}
