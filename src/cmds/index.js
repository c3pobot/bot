'use strict'
const log = require('logger')
const replyMsg = require('src/helpers/replyMsg')
const replyError = require('src/helpers/replyError')

const Cmds = {}
Cmds.avatar = require('./avatar')
Cmds.emotes = require('./emotes')
Cmds.iam = require('./iam')
Cmds.poll = require('./poll')
Cmds['self-assign'] = require('./self-assign')

const callCommand = async(command, obj, opt = {})=>{
  try{
    let msg2send = await Cmds[command](obj, opt)
    if(msg2send) replyMsg(obj, msg2send)
  }catch(e){
    log.error(e)
    replyError(obj)
  }
}

module.exports.sendCmd = async(command, obj, opt = {})=>{
  try{
    if(!obj) return
    if(!obj?.guildId){
      await obj.deferUpdate()
      replyMsg(obj, { content: 'Oh dear! I don\'t work very well in DM\'s'})
      return;
    }
    if(!obj || !command || !Cmds[command]){
      await obj.deferUpdate()
      replyMsg(obj, { content: 'Oh dear! Command not recognized...' })
      return
    }
    if(obj.isButton()) await obj.deferUpdate()
    if(obj.isCommand()) await obj.reply({ content: 'Here we go again...' })
    if(obj.isStringSelectMenu()) await obj.deferUpdate()
    callCommand(command, obj, opt)
  }catch(e){
    log.error(e)
  }
}
module.exports.localCmds = Cmds
