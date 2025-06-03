'use strict'
const bot = require('src/bot')
module.exports = async(obj = {}, bot)=>{
  if(!obj.sId || !bot?.isReady()) return

  let res = bot?.guilds?.cache?.get(obj.sId)
  if(!res) res = await bot?.guilds?.fetch(obj.sId)
  return res
}
