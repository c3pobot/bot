'use strict'
const GetMsgOpts = require('./getMsgOpts')
const CheckForInvite = require('./checkForInvite')
const Cmds = {}
let msgOpts = {}
const SyncMsgOpts = async()=>{
  try{
    let obj = await GetMsgOpts(mongoReady)
    if(obj) msgOpts = obj
    setTimeout(SyncMsgOpts, 60000)
  }catch(e){
    console.error(e);
    setTimeout(SyncMsgOpts, 5000)
  }
}
SyncMsgOpts()
module.exports = async(obj, cmdType = 'reaction')=>{
  try{
    if(cmdType === 'translate' && objj?.reaction && obj?.usr) Cmds.translate(obj?.reaction, obj?.usr, msgOpts)
    if(cmdType === 'editMsg' && objj?.newMsg && obj?.oldMsg) Cmds.editMsg(obj?.newMsg, obj?.oldMsg, msgOpts)
    if(!obj?.guild || obj?.author?.bot || botReady === 0 || botReady === 0 || cmdType === 'translate' || cmdType === 'editMsg') return;
    if(Cmds[cmdType]) Cmds[cmdType](obj, msgOpts)
  }catch(e){
    console.error(e);
  }
}
