const CreateQueObj = require('./createQueObj')
const CmdQue = require('cmdQue')
module.exports = async(msg, queName, usr, emoji)=>{
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
    console.log(queName)
    CmdQue.add(queName, msgObj)
  }catch(e){
    throw(e);
  }
}
