'use strict'
const log = require('logger')
const { msgOpts } = require('helpers/msgOpts')
const Cmds = {}
Cmds.addMember = require('./addMember')
Cmds.messageCreate = require('./messageCreate')
Cmds.messageDelete = require('./messageDelete')
Cmds.messageReactionAdd = require('./messageReactionAdd')
Cmds.messageUpdate = require('./messageUpdate')
Cmds.removeMember = require('./removeMember')
module.exports = async(obj, cmdType = 'reaction', bot)=>{
  try{
    if(Cmds[cmdType]) Cmds[cmdType](obj, bot)
  }catch(e){
    log.error(e);
  }
}
