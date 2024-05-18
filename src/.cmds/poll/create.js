'use strict'
const mongo = require('mongoclient')
const getPollMsg = require('./getPollMsg')
const { v4: uuidv4 } = require('uuid')

module.exports = async(obj, opt = {})=>{
  let chId = obj.options?.get('channel')?.value || obj.channelId
  let question = obj.options?.get('question')?.value?.toString()?.trim()
  let responses = obj.options?.get('responses')?.value?.trim()?.split(';')
  if(!question || !responses || !chId) return { content: 'you did not provide the correct information...' }

  let channel = obj.guild?.channels?.cache?.get(chId)
  if(!channel) return { content: `unable to send messages to <#${chId}>...`}

  if(responses?.length >= 25) return { content: 'you can only provide 25 responses' }

  let username = obj.member?.nick || obj.member?.username, pollId = uuidv4(), x = 0
  responses = responses.sort()

  let poll = {
    id: pollId,
    chId: chId,
    answers: responses?.map((x, index)=>{ return { id: index, answer: x?.trim() }}) || [],
    status: 1,
    question: question,
    sId: obj.guildId,
    votes: []
  }
  if(!pollData?.answers == pollData?.answers?.length == 0) return { content: 'error creating poll' }

  poll.msg = getPollMsg(poll)
  if(!pollMsg?.msg?.components || pollMsg?.msg?.components?.length == 0) return { content: 'error creating poll' }

  let respMsg = {
    color: 15844367,
    timestamp: new Date(),
    title: `Poll started in #${channel.name}`,
    description: '**'+question+'**\nAnswers : \n```\n'
  }
  for(let i in poll) respMsg.description += `${poll[i].answer}\n`
  await mongo.set('poll', { _id: pollId }, poll)

  let msg2send = { content: null, components: [], embeds: [respMsg] }
  if(poll.chId == obj.channelId) msg2send.components = poll.msg.components

  if(poll.chId !== obj.channelId) await channel.send(poll.msg)

  return msg2send

}
