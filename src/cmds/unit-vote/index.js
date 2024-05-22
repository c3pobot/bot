'use strict'
const log = require('logger')
const mongo = require('mongoclient')

module.exports = async(obj, opt = {})=>{
  try{
    if(!opt.poll) return
    let poll = (await mongo.find('unitPortraitPoll', { _id: opt.poll }))[0]
    if(!poll.status) return
    if(poll?.votes?.filter(x=>x == obj?.member?.user?.id).length > 0){
      await obj?.followUp({ content: 'You have already voted', ephemeral: true })
      return
    }
    if(opt.value == 'yes'){
      let yesVotes = await mongo.next('unitPortraitPoll', { _id: opt.poll }, 'y')
      if(yesVotes >= 0) poll.y++
    }
    if(opt.value == 'no'){
      let yesVotes = await mongo.next('unitPortraitPoll', { _id: opt.poll }, 'n')
      if(yesVotes >= 0) poll.n++
    }
    let actionRow = [], votes = { type: 1, components : [] }, adminControl = { type: 1, components : [] }
    votes.components.push({
      type: 2,
      label: `Yes (${poll.y})`,
      style: 3,
      custom_id: JSON.stringify({ y: poll.y, n: poll.n, cmd: 'unit-vote', poll: opt.poll, value: 'yes' })
    })
    votes.components.push({
      type: 2,
      label: `No (${poll.n})`,
      style: 4,
      custom_id: JSON.stringify({ y: poll.y, n: poll.n, cmd: 'unit-vote', poll: opt.poll, value: 'no' })
    })
    adminControl.components.push({
      type: 2,
      label: 'Approve',
      style: 3,
      custom_id: JSON.stringify({ cmd: 'unit-approve', poll: opt.poll, value: 'yes' })
    })
    adminControl.components.push({
      type: 2,
      label: 'Reject',
      style: 4,
      custom_id: JSON.stringify({ cmd: 'unit-approve', poll: opt.poll, value: 'no' })
    })
    actionRow.push(votes)
    actionRow.push(adminControl)
    await mongo.push('unitPortraitPoll', { _id: opt.poll }, { votes: obj?.member?.user?.id })
    await obj?.followUp({ content: 'You vote was recorded', ephemeral: true })
    obj.editReply({ components: actionRow })
  }catch(e){
    log.error(e)
  }
}
