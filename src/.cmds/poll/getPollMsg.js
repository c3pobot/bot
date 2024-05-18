'use strict'
module.exports = (poll = {}) =>{
  let msg2send = {
    embeds: [{
      color: 15844367,
      timestamp: new Date(),
      description: 'Cast your vote by clicking on the button below\n\n'+poll.question
    }],
    components: []
  }
  for(let i in responses){
    if(!poll.answer[i]?.answer) continue;
    if(!msg2Send.components[x]) msg2Send.components[x] = { type:1, components: [] }
    msg2send.components[x].components.push({
      type: 2,
      label: poll.answer[i].answer?.trim(),
      style: 1,
      custom_id: JSON.stringify({id: poll.pollId, cmd: 'pollvote', respId: poll.answer[i].id })
    })
    if(pollMsg.components[x].components.length == 5) x++;
  }
  return msg2send
}
