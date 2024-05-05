'use strict'
const Cmds = {}
Cmds.PollStats = async(poll)=>{
  const embedMsg = {
    color: 15844367,
    timestamp: new Date(),
    description: poll.question+'\n```\n'
  }
  let votes = []
  for(let i in poll.answers){
    const tempObj = Object.assign({}, poll.answers[i])
    tempObj.votes = +poll.votes.filter(x=>x.vote == tempObj.id).length || 0
    votes.push(tempObj)
  }
  if(votes.length > 0){
    votes = await sorter([{column: 'votes', order: 'descending'}], votes)
    for(let i in votes){
      embedMsg.description += votes[i].votes.toString().padStart(2, '0')+' : '+votes[i].answer+'\n'
    }
    embedMsg.description += '```'
    return embedMsg
  }
}
module.exports = Cmds
