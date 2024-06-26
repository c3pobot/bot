'use strict'
const log = require('logger')
const replyMsg = require('src/helpers/replyMsg')
const replyError = require('src/helpers/replyError')

const Cmds = {}
Cmds.avatar = require('./avatar')
Cmds.emotes = require('./emotes')
Cmds.gif = require('./gif')
Cmds.iam = require('./iam')
Cmds.iamnot = require('./iamnot')
Cmds.roles = require('./roles')
Cmds.roll = require('./roll')
Cmds['self-assign'] = require('./self-assign')
Cmds['unit-vote'] = require('./unit-vote')
Cmds['unit-approve'] = require('./unit-approve')
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

module.exports.sendCmd = async(command, obj, opt = {})=>{
  try{
    if(!obj) return
    if(!obj?.guildId){
      if(!obj.deferred && !obj.replied) await obj.deferUpdate()
      replyMsg(obj, { content: 'Oh dear! I don\'t work very well in DM\'s'})
      return;
    }
    if(!obj || !command || !Cmds[command]){
      if(!obj.deferred && !obj.replied) await obj.deferUpdate()
      replyMsg(obj, { content: 'Oh dear! Command not recognized...' })
      return
    }
    if(obj.isButton() && !obj.deferred && !obj.replied) await obj.deferUpdate()
    if(opt.dId && opt.dId !== obj?.user?.id) return
    if(obj.isCommand() && !obj.deferred && !obj.replied) await obj.reply({ content: 'Here we go again...' })
    if(obj.isStringSelectMenu() && !obj.deferred && !obj.replied) await obj.deferUpdate()

    callCommand(command, obj, opt)
  }catch(e){
    log.error(e)
  }
}
module.exports.localCmds = Cmds
