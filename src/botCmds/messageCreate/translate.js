const log = require('logger')
const CreateQueObj = require('./createQueObj')
const cmdQue = require('cmdQue')
module.exports = async(msg, usr, emoji)=>{
  try{
    let msgObj = await CreateQueObj(msg, 'translate')
    msgObj = {
      ...msgObj,
      ...{
        data: { name: 'runner' }
      }
    }
    if(emoji) msgObj.emojiName = emoji
    if(usr) msgObj.dId = usr.id
    cmdQue.add('discord', msgObj)
  }catch(e){
    log.error(e);
  }
}
