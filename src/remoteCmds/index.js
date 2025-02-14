'use strict'
const log = require('logger')
const bot= require('src/bot')

const Cmds = {}
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
module.exports = Cmds

module.exports = async(data = {}, res)=>{
  try{
    if(!bot?.isReady() || !data.podName || data.podName !== bot?.podName){
      res.sendStatus(400)
      return
    }
    if(!data?.cmd || !Cmds[data?.cmd]){
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
