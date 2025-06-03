'use strict'
const log = require('logger')
const Cmds = {}
Cmds.getAvatar = require('./getAvatar')
Cmds.getChannel = require('./getChannel')
Cmds.getGuild = require('./getGuild')
Cmds.getGuildMember = require('./getGuildMember')
Cmds.getGuildMemberRoles = require('./getGuildMemberRoles')
Cmds.getGuilds = require('./getGuilds')
Cmds.getMember = require('./getMember')
Cmds.getMemberGuilds = require('./getMemberGuilds')
Cmds.getNumShards = require('./getNumShards')
Cmds.getRole = require('./getRole')
Cmds.getServerStats = require('./getServerStats')
module.exports = async( data = {})=>{
  try{
    if(!data.cmd || !Cmds[data.cmd]) return
    return await Cmds[data.cmd](data)
  }catch(e){
    log.error(e)
  }
}
