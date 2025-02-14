'use strict'
const log = require('logger')
const bot = require('../bot')
const getChannel = require('./getChannel')
const blacklist = require('./blacklist')
const convertFiles = require('./convertFiles')

const Cmds = {}
Cmds.reply = async(channel, data = {})=>{
  try{
    if(!data.msgId) return
    let message = await channel?.messages?.fetch(data.msgId)
    if(message) return await message?.reply(data.msg)
    return await channel?.send(data.msg)
  }catch(e){
    throw(e)
  }
}
Cmds.post = async(channel, data = {})=>{
  try{
    return await channel?.send(data.msg)
  }catch(e){
    throw(e)
  }
}
module.exports = async( data = {})=>{
  try{
    if(!bot?.isReady() || !data.chId || !data.msg) return
    let channel = await getChannel(data.chId)
    if(!channel) return


    if(!channel.permissionsFor(channel.guild?.members?.me)?.has('SendMessages')){
      log.debug(`I do not have SendMessages permissions for ${data.chId}...`)
      return
    }

    if(data?.msg?.embeds?.length > 0 && !channel.permissionsFor(channel.guild?.members?.me)?.has('EmbedLinks')){
      log.debug(`I do not have EmbedLinks permission for ${data.chId}...`)
      return await channel?.send('I do not have EmbedLinks permission for this channel...')
    }

    if(data.file || data.files || data.msg.file || data.msg.files) data.msg.files = convertFiles(data)
    if(data?.msg?.file?.length > 0 && !channel.permissionsFor(channel.guild?.members?.me)?.has('AttachFiles')){
      log.debug(`I do not have AttachFiles permission for ${data.chId}...`)
      return await message.edit(`I do not have AttachFiles permission for this channel...`)
    }

    if(!data?.msgId) return await channel?.send(data.msg)
    let message = await channel?.messages?.fetch(data.msgId)
    return await message?.reply(data.msg)
  }catch(e){
    blacklist.report({ chId: data.chId, msgId: data.msgId }, e)
  }
}
