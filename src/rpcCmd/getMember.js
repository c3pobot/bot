'use strict'
const bot = require('src/bot')

module.exports = async(obj = {})=>{
  if(!obj.dId || !bot?.isReady()) return

  let usr = bot.users?.cache?.get(obj.dId)
  if(!usr) usr = await bot.users?.fetch(obj.dId)
  return usr
}
