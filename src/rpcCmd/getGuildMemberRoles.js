'use strict'
const bot = require('src/bot')
const queryGuild = require('./queryGuild')

module.exports = async(obj = {})=>{
  if(!obj.sId || !obj.dId || !bot?.isReady()) return;

  let guild = await queryGuild(obj)
  if(!guild) return

  let usr = await guild.members.fetch(obj.dId)
  if(!usr) return

  let roles = guildUser.roles?.cache?.map(x=>x.id)
  return roles
}
