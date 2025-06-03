'use strict'
const bot = require('src/bot')
module.exports = async(obj ={})=>{
  if(!obj.chId || !bot?.isReady()) return;

  let channel = bot?.channels?.cache?.get(obj.chId)
  if(!channel) channel = await bot?.channels?.fetch(obj.chId)
  return channel
}
