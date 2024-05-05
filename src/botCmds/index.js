'use strict'
const log = require('logger')
const Cmds = {}
Cmds.addMember = require('./addMember')
Cmds.messageCreate = require('./messageCreate')
Cmds.messageDelete = require('./messageDelete')
Cmds.messageReactionAdd = require('./messageReactionAdd')
Cmds.messageUpdate = require('./messageUpdate')
Cmds.removeMember = require('./removeMember')

module.exports = async(obj, cmdType = 'reaction', bot)=>{
  try{
    if(Cmds[cmdType]) await Cmds[cmdType](obj, bot)
  }catch(e){
    log.error(e);
  }
}
