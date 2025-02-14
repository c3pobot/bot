'use strict'
const log = require('logger')
const bot = require('../bot')

const blacklist = require('./blacklist')
const convertFiles = require('./convertFiles')
const getChannel = require('./getChannel')

module.exports = async(data = {})=>{
  try{
    if(!bot?.isReady() || !data.chId || !data.msg || !data.msgId) return
    let channel = await getChannel(data.chId)
    if(!channel) return

    let message = await channel?.messages?.fetch(data.msgId)
    if(!message) return
    if(data?.msg?.embeds?.length > 0 && !channel.permissionsFor(channel.guild?.members?.me)?.has('EmbedLinks')){
      log.debug(`I do not have EmbedLinks permission for ${data.chId}...`)
      return await message?.edit(`I do not have EmbedLinks permission for this channel...`)
    }
    if(!channel.permissionsFor(channel.guild?.members?.me)?.has('ManageMessages') && message?.author?.id !== bot?.application?.id){
      log.debug(`bot does not have ManageMessages permission in channel ${data.chId}`)
      return
    }
    if(data.file || data.files || data.msg.file || data.msg.files) data.msg.files = convertFiles(data)
    if(data?.msg?.file?.length > 0 && !channel.permissionsFor(channel.guild?.members?.me)?.has('AttachFiles')){
      log.debug(`I do not have AttachFiles permission for ${data.chId}...`)
      return await message.edit(`I do not have AttachFiles permission for this channel...`)
    }
    return await message?.edit(data.msg)


  }catch(e){
    //log.error(e)
    blacklist.report({ chId: data.chId, msgId: data.msgId }, e)
  }
}
