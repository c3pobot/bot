'use strict'
module.exports = async(obj ={}, bot)=>{
  if(!obj.chId || !bot) return;
  let channel = bot?.channels?.cache?.get(obj.chId)
  if(!channel) channel = await bot?.channels?.fetch(obj.chId)
  return channel
}
