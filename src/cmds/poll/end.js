'use stric'
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
  let pollId = opt.pollId, chId = obj.options?.get('channel')?.value || obj?.channelId
  let polls = await mongo.find('poll', { sId: obj.guildId, status: 1 })
  if(!polls || polls?.length == 0) return { content: 'there are no active polls in this server' }

  polls = polls.filter(x=>x.chId === chId)
  if(!polls || polls?.length == 0) return { content: `there are no active polls in <#${chId}>` }

  if(!pollId) return getPolls(obj, opt, polls, 'end')

  let poll = polls.find(x=>x.id === pollId)
  if(!poll)  return { content: 'Error finding poll' }

  let embedMsg = getPollStats(poll)
  if(!embedMsg) return { content: 'error getting poll stats...' }

  await mongo.set('polls', { _id: pollId }, { status: 0 })
  return { content: null, embeds: [embedMsg] }
}
