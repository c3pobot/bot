'use strict'
const truncateString = (str, num)=>{
  if(str.length > num){
    str = str.slice(0, (num - 3))
    str += '...'
  }
  return str
}
module.exports = (obj, opt = {}, polls = [], subCmd = 'stats')=>{
  if(!subCmd) return
  let x = 0, msg2send = {
    content: 'There are multiple polls. Which one do you want?\nNote: Green is active Red is inactive',
    components: []
  }
  for(let i in polls){
    if(!msg2send.components[x]) msg2send.components[x] = { type:1, components: [] }
    msg2send.components[x].components.push({
      type: 2,
      label: truncateString(polls[i].question, 75),
      style: (polls[i].status ? 3:4),
      custom_id: JSON.stringify({cmd: 'poll', subCmd: subCmd, pollId: polls[i]._id})
    })
    if(msg2send.components[x].components.length == 5 && msg2send.components.length < 5) x++;
  }
  return msg2send
}
