'use strict'
module.exports = async(obj, opt = [])=>{
  try{
    let id, msg2send = {content: 'You did not provide the correct information'}
    if(opt.find(x=>x.name == 'id')) id = opt.find(x=>x.name == 'id').value
    if(id){
      msg2send.content = 'ID **'+id+'** is not for a personal custom reaction'
      const lCR = (await mongo.find('reactions', {_id: obj.member.user.id}))[0]
      if(lCR && lCR.cr && lCR.cr.filter(x=>x.id == id)){
        await mongo.pull('reactions', {_id: obj.member.user.id}, {cr:{id: id}})
        msg2send.content = 'Perasonal custom reaction with ID **'+id+'** and trigger **'+lCR.cr.find(x=>x.id == id).trigger+'** has been deleted'
      }
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.error(e)
    HP.ReplyError(obj)
  }
}
