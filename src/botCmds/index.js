'use strict'
const { mongoStatus } = require('mongoapiclient')
const GetMsgOpts = require('helpers/getMsgOpts')
const Cmds = {}
Cmds.addMember = require('./addMember')
Cmds.messageCreate = require('./messageCreate')
Cmds.messageDelete = require('./messageDelete')

Cmds.messageUpdate = require('./messageUpdate')
Cmds.removeMember = require('./removeMember')
let msgOpts = {}, mongoReady

const SyncMsgOpts = async()=>{
  try{
    let checkTime = 60
    if(!mongoReady) mongoReady = mongoStatus()
    if(!mongoReady) checkTime = 5
    if(mongoReady){
      let obj = await GetMsgOpts(mongoReady)
      if(obj) msgOpts = obj
    }
    setTimeout(SyncMsgOpts, checkTime * 1000)
  }catch(e){
    console.error(e);
    setTimeout(SyncMsgOpts, 5000)
  }
}
SyncMsgOpts()
module.exports = async(obj, cmdType = 'reaction', bot)=>{
  try{
    if(mongoReady) return;
    if(Cmds[cmdType]) Cmds[cmdType](obj, msgOpts, bot)
  }catch(e){
    console.error(e);
  }
}
