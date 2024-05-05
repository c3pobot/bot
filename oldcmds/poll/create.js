'use strict'
const { v4: uuidv4 } = require('uuid')
module.exports = async(obj, opt = [])=>{
  try{
    let msg2send = {content: 'This command is only avaliable to server Admins'}, responses = [], question, chId = obj.channel_id, auth = 0
    if(await HP.CheckServerAdmin(obj)){
      msg2send.content = 'You must provide a poll question'
      if(opt.find(x=>x.name == 'question')) question = opt.find(x=>x.name == 'question').value.trim()
      if(opt.find(x=>x.name == 'channel')) chId = opt.find(x=>x.name == 'channel').value
    }
    if(question){
      msg2send.content = 'You must provide poll response(s)'
      let tempResp = []
      if(opt.find(x=>x.name == 'responses')) tempResp = opt.find(x=>x.name == 'responses').value.trim().split(';')
      if(tempResp.filter(x=>x != '').length > 0){
        msg2send.content = 'You can only provide 25 responses'
        if(tempResp.length < 26) responses = tempResp.filter(x=>x != '')
      }
    }
    if(responses.length > 0){
      const channel = await MSG.GetChannel(chId)
      let usrname = obj.member.user.username
      if(obj.member.nick) usrname = obj.member.nick
      msg2send.content = 'Unable to send messages to <#'+chId+'>'
      const sortedArray = await responses.sort((a,b)=>{return a-b})
      const pollId = await uuidv4()
      const pollMsg = {
        embed: {
          color: 15844367,
          timestamp: new Date(),
          description: 'Cast your vote by clicking on the button below\n\n'+question,
          author: {
            name: '@'+usrname+' has started a poll'
          }
        },
        components: []
      }
      const tempObj = {
        chId: chId,
        answers: [],
        status: 1,
        question: question,
        sId: obj.guild_id,
        votes: []
      }
      const respMsg = {
        color: 15844367,
        timestamp: new Date(),
        title: 'Poll started in '+(channel && channel.name ? '#'+channel.name:'<#'+poll.chId+'>'),
        description: '**'+question+'**\nAnswers : \n```\n'
      }
      let x = 0
      for(let i in sortedArray){
        if(sortedArray[i]){
          respMsg.description += sortedArray[i].trim()+'\n'
          if(!pollMsg.components[x]) pollMsg.components[x] = { type:1, components: []}
          pollMsg.components[x].components.push({
            type: 2,
            label: sortedArray[i].trim(),
            style: 1,
            custom_id: JSON.stringify({id: pollId, type: 'pollvote', respId: i})
          })
          tempObj.answers.push({id: i, answer: sortedArray[i].trim()})
          if(pollMsg.components[x].components.length == 5) x++;
        }
      }
      respMsg.description += '```'
      const status = await MSG.SendMsg({chId: chId, sId: channel?.guild_id}, pollMsg)
      if(status && status.id){
        msg2send.content = null
        msg2send.embeds = [respMsg]
        await mongo.set('poll', {_id: pollId}, tempObj)
      }
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
