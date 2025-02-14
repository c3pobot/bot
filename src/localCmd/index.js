'use strict'
const log = require('logger')
const replyMsg = require('src/helpers/replyMsg')
const replyError = require('src/helpers/replyError')

const Cmds = {}
Cmds.avatar = require('./avatar')
Cmds.emotes = require('./emotes')
Cmds.iam = require('./iam')
Cmds.iamnot = require('./iamnot')
Cmds.roles = require('./roles')
Cmds.roll = require('./roll')
Cmds['self-assign'] = require('./self-assign')
Cmds.whois = require('./whois')
const callCommand = async(command, obj, opt = {})=>{
  try{
    let msg2send = await Cmds[command](obj, opt)
    if(msg2send) replyMsg(obj, msg2send)
  }catch(e){
    log.error(e)
    replyError(obj)
  }
}

Cmds.sendCmd = async(command, obj, opt = {})=>{
  try{
    if(!obj) return
    if(!obj?.guildId){
      replyMsg(obj, { content: 'Oh dear! I don\'t work very well in DM\'s'})
      return;
    }
    if(!obj || !command || !Cmds[command]){
      replyMsg(obj, { content: 'Oh dear! Command not recognized...' })
      return
    }
    if(opt.dId && opt.dId !== obj?.user?.id) return
    if(obj.isCommand()) await obj.editReply({ content: 'Here we go again...' })

    callCommand(command, obj, opt)
  }catch(e){
    log.error(e)
  }
}
module.exports = Cmds
