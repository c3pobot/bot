'use strict'
module.exports = async(obj)=>{
  try{
    console.log(obj)
    let msg2send = {content: 'Error'}, resp, sendResp = 0, poll, usrname = obj.member.user.username, sendMethod = 'POST'
    if(obj.member.nick) usrname = obj.member.nick
    if(obj.data && obj.data.custom_id) resp = JSON.parse(obj.data.custom_id)
    if(resp && resp.id){
      poll = (await mongo.find('poll', {_id: resp.id}))[0]
    }
    if(poll){
      sendResp = 1
      if(poll.status){
        msg2send.content = '@'+usrname+' has already voted in this poll'
        msg2send.flags = 64
        if(poll.votes.filter(x=>x.dId == obj.member.user.id).length == 0){
          await mongo.push('poll', {_id: resp.id}, {votes:{dId: obj.member.user.id, vote: resp.respId, name: usrname}})
          msg2send.content = '@'+usrname+' your vote was recorded'
        }
      }else{
        sendMethod = 'PATCH'
        msg2send.content = 'This poll is closed'
        msg2send.components = []
      }
    }
    if(sendResp) MSG.WebHookMsg(obj.token, msg2send, sendMethod)
    HP.RemoveJob(obj.id)
  }catch(e){
    console.log(e)
  }
}
