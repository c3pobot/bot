'use strict'
const bot = require('src/bot')
const queryGuild = require('./queryGuild')

module.exports = async(obj = {})=>{
  if(!obj.dId || !obj.sId || !bot?.isReady()) return

  let guild = await queryGuild(obj)
  if(!guild) return

  let guildUser = await guild?.members?.fetch(obj.dId)
  if(!guildUser) return;
  
  return await guildUser?.user?.avatarURL({format: 'png', dynamic: true, size: 256})
}
