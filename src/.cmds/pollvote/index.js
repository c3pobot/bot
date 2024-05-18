'use strict'
module.exports = async(obj, opt = {})=>{
  if(!opt.id) return
  let poll = (await mongo.find('poll', { _id: opt.id }))[0]
  if(!poll){
    obj?.channel?.send({ content: 'Error finding poll', flags: 64 })
    return
  }
  if(!poll.status){
    obj?.channel?.send({ content: 'this poll is closed', flags: 64 })
    return
  }
  if(poll.votes?.filter(x=>x.dId == obj?.user?.id).length == 0){
    obj?.channel?.send({ content: 'You have already voted in this poll', flags: 64 })
    return
  }
  let usrname = obj?.member?.nickname || obj?.user?.username
  await mongo.push('poll', {_id: resp.id}, {votes:{dId: obj.member.user.id, vote: resp.respId, name: usrname}})
  obj.channel.send({ content: `@${usrname} your vote was recorded`, flags: 64 })
  return
}
