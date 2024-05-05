'use strict'
module.exports = async(obj, opt = [])=>{
  try{
    let msg2send = {content: 'Nothing was changed'}
    if(opt.find(x=>x.name == 'confirm') && opt.find(x=>x.name == 'confirm').value == 'yes'){
      await mongo.del('reactions', {_id: obj.member.user.id})
      msg2send.content = 'All Personal Custom Reactions have been cleared'
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
