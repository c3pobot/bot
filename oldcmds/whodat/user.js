'use strict'
module.exports = async(obj, opt)=>{
  try{
    let msg2send = {content: 'You did not provide the correct information'}, id
    if(opt.find(x=>x.name == 'id')) id = opt.find(x=>x.name == 'id').value
    if(id){
      msg2send.content = 'Error finding user **'+id+'**'
      const usr = await MSG.GetUser(id)
      if(usr){
        const embedMsg = {
          color: 15844367,
          description: 'dId '+id+' info for C3PO\n```\n'
        }
        embedMsg.description += 'Member        : @'+usr.username+'\n'
        embedMsg.description += 'Member Tag    : @'+usr.username+'#'+usr.discriminator+'\n'
        embedMsg.description += '```'
        msg2send.content = null
        msg2send.embeds = [embedMsg]
      }
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
