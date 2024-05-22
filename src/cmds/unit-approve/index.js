'use strict'
const mongo = require('mongoclient')
const restoreMsg = require('./restoreMsg')
const BOT_OWNER_ID = process.env.BOT_OWNER_ID
const cmdQue = require('src/cmdQue')

module.exports = async(obj, opt = {})=>{
  if(!BOT_OWNER_ID || obj?.member?.user?.id !== BOT_OWNER_ID) return

  if(opt.confirm == 'no'){
    restoreMsg(obj, opt)
    return
  }
  if(!opt.confirm){
    let actionRow = [{ type: 1, components: [] }]
    actionRow[0].components.push({
      type: 2,
      label: `${(opt.value == 'yes' ? 'Approve':'Reject')}`,
      style: 3,
      custom_id: JSON.stringify({ cmd: 'unit-approve', value: opt.value, poll: opt.poll, confirm: 'yes' })
    })
    actionRow[0].components.push({
      type: 2,
      label: 'Cancel',
      style: 4,
      custom_id: JSON.stringify({ cmd: 'unit-approve', value: opt.value, poll: opt.poll, confirm: 'no' })
    })
    await obj.editReply({ content: `Are you sure you want to **${(opt.value == 'yes' ? 'APPROVE':'REJECT')}** this image change?`, components: actionRow })
    return
  }

  if(opt.confirm !== 'yes'){
    restoreMsg(obj, opt)
    return
  }
  let poll = (await mongo.find('unitPortraitPoll', { _id: opt.poll }))[0]

  if(!poll?.base64Img || !poll?.thumbnailName){
    restoreMsg(obj, opt)
    return
  }
  if(opt.value == 'yes'){
    let status = await cmdQue.add('assets', { type: 'communityVote', img: poll.thumbnailName, dir: 'portrait', assetVersion: 'communityVote', base64Img: poll.base64Img })
    if(!status){
      restoreMsg(obj, opt)
      return
    }
  }

  await mongo.set('unitPortraitPoll', { _id: opt.poll }, { status: false, approved: opt.value })
  obj.editReply({ content: `portrait change was ${(opt.value == 'yes' ? 'Approved':'Rejected')} with poll results of ${poll.y} to ${poll.n}`, components: [] })
}
