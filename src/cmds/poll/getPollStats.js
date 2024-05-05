'use strict'
module.exports = (poll = {})=>{
  let votes = [], embedMsg = {
    color: 15844367,
    timestamp: new Date(),
    description: poll.question+'\n```\n'
  }
  for(let i in poll.answers){
    let tempObj = Object.assign({}, poll.answers[i])
    tempObj.votes = +poll.votes.filter(x=>x.vote == tempObj.id).length || 0
    votes.push(tempObj)
  }
  if(!votes || votes?.length == 0){
    embedMsg.description += 'No one has voted yet\n```'
    return embedMsg
  }

  for(let i in votes) embedMsg.description += `${votes[i]?.votes?.toString()?.padStart(2, '0')} : ${votes[i].answer}\n`
  embedMsg.description += '```'
  return embedMsg
}
