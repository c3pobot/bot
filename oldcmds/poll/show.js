'use strict'
const TruncateString = (str, num)=>{
  if(str.length > num){
    str = str.slice(0, (num - 3))
    str += '...'
  }
  return str
}
module.exports = async(obj, opt = [] )=>{
    try{
      let msg2send = {content: 'This command is only avaliable to server Admins'}, auth = 0, polls, poll, pollId, sendResp = 1
      if(await HP.CheckServerAdmin(obj)){
        auth ++
        msg2send.content = 'Error finding poll'
        if(obj.confirm && obj.confirm.pollId) pollId = obj.confirm.pollId
      }
      if(auth){
        msg2send.content = 'there are no polls running in this channel'
        polls = await mongo.find('poll', {sId: obj.guild_id, chId: obj.channel_id, status: 1})
      }
      if(polls && polls.length > 0){
        msg2send.content = 'Error finding poll'
        if(pollId){
          if(polls.filter(x=>x._id == pollId)) poll = polls.find(x=>x._id == pollId)
        }else{
          if(polls.length == 1){
            poll = polls[0]
          }else{
            if(polls.filter(x=>x.status).length == 1){
              poll = polls.filter(x=>x.status)[0]
            }else{
              sendResp = 0
              const embedMsg = {
                content: 'There are multiple polls running in <#'+obj.channel_id+'>. Which one do you want to repost the message for?',
                components: []
              }
              let x = 0
              for(let i in polls){
                if(!embedMsg.components[x]) embedMsg.components[x] = { type:1, components: []}
                const buttonLabel = await TruncateString(polls[i].question, 75)
                embedMsg.components[x].components.push({
                  type: 2,
                  label: buttonLabel,
                  style: 3,
                  custom_id: JSON.stringify({id: obj.id, pollId: polls[i]._id})
                })
                if(embedMsg.components[x].components.length == 5 && embedMsg.components.length < 5) x++;
              }
              await HP.ButtonPick(obj, embedMsg)
            }
          }
        }
      }
      if(poll && poll.question && poll.answers && poll.answers.length > 0){
        await HP.ReplyButton(obj, 'Getting poll stats')
        let usrname = obj.member.user.username
        if(obj.member.nick) usrname = obj.member.nick
        msg2send.content = null
        msg2send.embeds = [{
          color: 15844367,
          timestamp: new Date(),
          description: 'Cast your vote by clicking on the button below\n\n'+poll.question,
          author: {
            name: '@'+usrname+' has started a poll'
          }
        }]
        msg2send.components = []
        let x = 0
        for(let i in poll.answers){
          if(!msg2send.components[x]) msg2send.components[x] = { type:1, components: []}
          msg2send.components[x].components.push({
            type: 2,
            label: poll.answers[i].answer,
            style: 1,
            custom_id: JSON.stringify({id: poll._id, type: 'pollvote', respId: poll.answers[i].id})
          })
          if(msg2send.components[x].components.length == 5) x++;
        }
      }
      if(sendResp) HP.ReplyMsg(obj, msg2send)
    }catch(e){
      console.log(e)
      HP.ReplyError(obj)
    }
}
