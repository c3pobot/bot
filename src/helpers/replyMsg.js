'use strict'
module.exports = (obj, msg2send)=>{
  if(!msg2send || !obj) return
  if(obj.isButton() || obj.isStringSelectMenu()){
    obj.message.edit(msg2send)
    return
  }
  obj.editReply(msg2send)
}
