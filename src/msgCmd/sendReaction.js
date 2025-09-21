'use strict'
const log = require('logger')
const rabbitmq = require('src/rabbitmq')
const { botSettings } = require('src/helpers/botSettings')
let POD_NAME = process.env.POD_NAME || 'bot', NAME_SPACE = process.env.NAME_SPACE || 'default'
let AI_RUNNER_EXCHANGE = `${NAME_SPACE}.msg.ai-runner`

module.exports = (msg)=>{
  try{
    let data = {
      id: msg?.id,
      podName: POD_NAME,
      cmd: 'reactions',
      content: msg.content.toString().trim(),
      reference: msg.reference,
      mentionIds: (msg?.mentions?.members?.map(x=>x.id) || [])?.concat(msg?.mentions?.roles?.map(x=>x.id) || []),
      userMentions: msg?.mentions?.members?.map(x=>{ return { id: x.id, name: x.nickname || x.user?.username }}),
      roleMentions: msg?.mentions?.roles?.map(x=>{ return { id: x.id, name: x.name}}),
      dId: msg?.author?.id,
      username: msg?.author?.globalName || msg.author?.username,
      chId: msg?.channel?.id,
      sId: msg?.guild?.id,
      botPerms: msg.channel?.permissionsFor(msg?.channel?.guild?.members?.me)?.toArray()
    }
    if(data.mentionIds?.length > 0){
      for(let i in data.mentionIds){
        if(botSettings?.botIDs?.has(data.mentionIds[i])){
          rabbitmq.notify({ cmd: 'ai_message', msg: data }, null, AI_RUNNER_EXCHANGE)
          return
        }
      }
    }
    rabbitmq.add('runner', data)
  }catch(e){
    log.error(e)
  }
}
