'use strict'
module.exports = async(obj = {})=>{
  try{
    const auth = await HP.CheckServerAdmin(obj)
    if(auth){
      let chId, msg, channelPerm = 1, usr, msg2send = {content: 'You did not provide the correct information'}
      if(obj.data.options){
        if(obj.data.options.find(x=>x.name == 'channel')) chId = obj.data.options.find(x=>x.name == 'channel').value
        if(obj.data.options.find(x=>x.name == 'message')) msg = obj.data.options.find(x=>x.name == 'message').value
        if(obj.data.options.find(x=>x.name == 'user')) usr = obj.data.options.find(x=>x.name == 'user').value
      }
      if(msg && usr) msg = msg.replace(/%user%/g, '<@'+usr+'>')
      if(msg && chId){
        msg2send.content = 'I don\'t have permissions to send messages to <#'+chId+'>'
        const checkPerm = await MSG.GetChannel(chId)
        if(!checkPerm || !checkPerm.id) channelPerm = 0
        if(checkPerm){
          msg2send.content = 'Error sending message to <#'+chId+'>'
          const status = await MSG.SendMsg({sId: obj.guild_id, chId: chId}, {content: msg})
          if(status?.id) msg2send.content = 'Messages successfully sent to <#'+chId+'>'
        }
      }
      HP.ReplyMsg(obj, msg2send)
    }else{
      HP.AdminNotAuth(obj)
    }
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
