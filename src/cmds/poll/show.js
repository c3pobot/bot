'use strict'
const mongo = require('mongoclient')
const getPolls = require('./getPolls')
const getPollMsg = require('./getPollMsg')
const { checkIsUser, replyButton } = require('src/helpers')

module.exports = async(obj, opt = {})=>{
  if(obj.customId){
    let auth = checkIsUser(obj)
    if(!auth) return
    await replyButton(obj)
  }

  let chId = obj.channelId, pollId = opt.pollId
  if(!chId) return { content: 'You did not specify a channel', components: [] }

  let polls = await mongo.find('poll', { sId: obj.guildId })
  if(polls) polls = polls?.filter(x=>x.chId === obj.channelId)
  if(!polls || polls?.length == 0) return { content: 'There are no polls in this server...', components: [] }

  if(!pollId) if(polls?.length == 1) pollId = polls[0].id
  if(!pollId) return getPolls(obj, opt, polls, 'show')

  let poll = polls.find(x=>x.id === pollId)
  if(!poll || !poll?.question || !poll?.answers || poll?.answers?.length == 0) return { content: 'error finding poll...', components: [] }

  if(!poll.msg) poll.msg = getPollMsg(poll)
  if(!poll.msg?.components || poll.msg?.components?.length == 0) return { content: 'error creating poll msg...', components: [] }

  return poll.msg  
}
