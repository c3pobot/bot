'use strict'
const log = require('logger')
const mongo = require('mongoclient')
module.exports = async(obj, opt = {})=>{
  if(!opt.poll) return
  let poll = (await mongo.find('unitPortraitPoll', { _id: opt.poll }))[0]

  if(!poll?.status) return

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
  obj.editReply({ content: `Vote for the new portrait (right) to replace the current (left)\n<${poll.image_link}>`, components: actionRow || [] })
}
