'use strict'
const log = require('logger')
const bot= require('src/bot')

const Cmds = {}
Cmds.editMsg = require('./editMsg')
Cmds.getAvatar = require('./getAvatar')
Cmds.getChannel = require('./getChannel')
Cmds.getGuild = require('./getGuild')
Cmds.getGuilds = require('./getGuilds')
Cmds.getGuildMember = require('./getGuildMember')
Cmds.getGuildMemberRoles = require('./getGuildMemberRoles')
Cmds.getMemberGuilds = require('./getMemberGuilds')
Cmds.getMember = require('./getMember')
Cmds.getRole = require('./getRole')
Cmds.getServerStats = require('./getServerStats')
Cmds.replyMsg = require('./replyMsg')
Cmds.sendMsg = require('./sendMsg')
Cmds.sendDM = require('./sendDM')
module.exports = Cmds

module.exports = async(data, res)=>{
  try{
    if(!bot?.isReady()) return
    if(bot?.podName && data?.podName !== bot?.podName){
      res.sendStatus(200)
      return
    }
    if(!data || !data?.cmd || !Cmds[data?.cmd]){
      res.sendStatus(400)
      return
    }
    let response = await Cmds[data.cmd](data, bot)
    if(response){
      res.status(200).json(response)
    }else{
      res.sendStatus(400)
    }
  }catch(e){
    log.error(e)
    res.sendStatus(400)
  }
}
