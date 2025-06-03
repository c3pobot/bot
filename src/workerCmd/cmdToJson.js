'use strict'
const log = require('logger')
const { getChannelObj, getMemberObj, getResolvedObj } = require('./getCmdObjects')

const POD_NAME = process.env.POD_NAME || 'bot'

const getUsers = (obj, resolved)=>{
  if(!obj.value || !resolved.members || !resolved.users) return
  return getMemberObj(resolved.users.get(obj.value)?.toJSON(), resolved.members.get(obj.value)?.toJSON())
}
const getRoles = (obj, resolved = {})=>{
  return obj?.role
}
const getChannels = (obj, resolved = {})=>{
  return getChannelObj(obj?.channel)
}
const typeEnum = {
  6: getUsers,
  8: getRoles,
  7: getChannels
}
const getResolvedData = (obj, resolved = {})=>{
  if(!obj.type || !obj.value) return
  if(typeEnum[obj.type]) return typeEnum[obj.type](obj, resolved)
}
const getOptions = (array = [], obj = { options: {} }, resolved = {})=>{
  if(!array || array?.length == 0) return
  for(let i in array){
    if(array[i].type === 2) obj.subCmdGroup = array[i].name
    if(array[i].type === 1) obj.subCmd = array[i].name
    if(array[i].type > 2){
      obj.options[array[i].name] = { name: array[i].name, value: array[i].value, data: getResolvedData(array[i], resolved) }
    }
    if(array[i].options) getOptions(array[i].options, obj, resolved)
  }
}
const getModalOptions = (array = [], obj = { options: {} })=>{
  if(!array || array?.length == 0) return
  for(let i in array) obj.options[array[i].customId] = array[i].value
}
const getPreviousCmd = (obj, data = {})=>{
  if(!obj) return
  data.previousId = obj.id
  let oldCmd = obj.commandName?.split(' ')
  if(!oldCmd) return
  data.cmd = oldCmd[0]
  data.subCmd = oldCmd[2]
  if(data.subCmd){
    data.subCmdGroup = oldCmd[1]
  }else{
    data.subCmd = oldCmd[1]
  }
}

const getInitialResponse = async(obj)=>{
  let msg = await obj.fetchReply()
  if(!msg?.id) return
  return { msgId: msg.id, chId: msg.channelId, sId: msg.guildId, botPerms: msg?.channel?.permissionsFor(msg?.channel?.guild?.members?.me)?.toArray() }
}
module.exports = async(obj = {})=>{
  try{
    let tempOptions = { options: {} }
    let guildOwner = obj.guild.members?.cache?.get(obj.guild?.ownerId)
    getOptions(obj.options?.data, tempOptions, obj.options?.resolved)
    if(obj.fields?.fields && obj.type === 5) getModalOptions(obj.fields.fields.toJSON(), tempOptions)
    let data = {
      id: obj.id,
      app_permissions: obj.appPermissions,
      application_id: obj.applicationId,
      cmd: obj.commandName,
      subCmd: tempOptions.subCmd,
      subCmdGroup: tempOptions.subCmdGroup,
      channel: getChannelObj(obj.channel),
      channel_id: obj.channel?.id,
      podName: POD_NAME,
      data: {
        id: obj.commandId,
        name: obj.commandName,
        type: obj.commandType,
        guild_id: obj.guild?.id,
        options: tempOptions.options,
        resolved: getResolvedObj(obj.options?.resolved),
        intialResponse: await getInitialResponse(obj)
      },
      guild: {
        id: obj.guild?.id,
        name: obj.guild?.name,
        shard_id: obj.guild?.shardId,
        owner_id: obj.guild?.ownerId,
        icon_url: obj.guild?.iconURL,
        owner_name: guildOwner?.nickname || guildOwner?.user?.username
      },
      guild_id: obj.guild?.id,
      member: getMemberObj(obj.user?.toJSON(), obj.member?.toJSON()),
      token: obj.token,
      type: obj.type,
      version: obj.version,
      created_timestamp: obj.createdTimestamp,
      timestamp: obj.createdTimestamp,
      selectValues: obj.values || [],
      modalFields: obj.fields,
      message: obj.message?.toJSON()
    }
    if(obj.customId){
      data.confirm = JSON.parse(obj.customId)
      if(!data.confirm?.id) getPreviousCmd(obj.message?.interaction, data)
    }
    if(data?.data?.options?.channel){
      data.data.options.channel.botPerms = obj.guild?.channels?.cache?.get(data.data.options.channel.value)?.permissionsFor(obj.client?.user)?.toArray()
    }

    data.cmd = data.confirm?.cmd || obj.commandName
    return data
  }catch(e){
    log.error(e)
  }
}
