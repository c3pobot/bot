'use strict'
const GetMsgOpts = require('./getMsgOpts')
const CheckForInvite = require('./checkForInvite')
const Cmds = {}
Cmds.addMember = require('./addMember')
Cmds.messageCreate = require('./messageCreate')
Cmds.messageDelete = require('./messageDelete')

Cmds.messageUpdate = require('./messageUpdate')
Cmds.removeMember = require('./removeMember')
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
    if(botReady === 0 || mongoReady === 0) return;
    if(Cmds[cmdType]) Cmds[cmdType](obj, msgOpts)
  }catch(e){
    console.error(e);
  }
}
