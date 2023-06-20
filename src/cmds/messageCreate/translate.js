const CreateQueObj = require('./createQueObj')
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
    Que.add(queName, msgObj)
  }catch(e){
    console.error(e);
  }
}
