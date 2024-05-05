'use strict'
const mongo = require('mongoclient')
const getPolls = require('./getPolls')
const getPollStats = require('./getPollStats')
const { checkIsUser, replyButton } = require('src/helpers')

module.exports = async(obj, opt = {})=>{
  if(obj.customId){
    let auth = checkIsUser(obj)
    if(!auth) return
    await replyButton(obj)
  }
  let chId = obj.options?.get('channel')?.value || obj.channelId
  if(!chId) return { content: 'You did not specify a channel' }

  let polls = await mongo.find('poll', { sId: obj.guildId })
  if(!polls || polls?.length == 0) return { content: 'There are no polls in this server...' }

  let pollId = opt.pollId
  if(!pollId) return getPolls(obj, opt, polls, 'stats')

  let poll = polls.find(x=>x.id === pollId)
  if(!poll) return { content: 'error finding poll...' }

  let embedMsg = getPollStats(poll)
  if(!embedMsg) return { content: 'error getting poll stats' }
  return { content: null, embeds: [embedMsg] }
}
