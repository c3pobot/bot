'use strict'
const bot = require('src/bot')
const queryGuild = require('./queryGuild')

module.exports = async(obj = {})=>{
  if(!obj.sId || !obj.roleId || !bot?.isReady()) return;

  let guild = await queryGuild(obj)
  if(!guild) return;

  let role = guild?.roles?.cache?.get(obj.roleId)
  if(!role) role = await guild?.roles?.fetch(obj.roleId)
  return role
}
