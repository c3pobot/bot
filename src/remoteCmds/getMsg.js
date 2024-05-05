'use strict'
const getChannel = require('./getChannel')
module.exports = async(obj = {}, bot)=>{
  if(!obj.msgId || !obj.chId) return
  let channel = await getChannel(obj, bot)
  if(!channel) return
  return await channel.messages?.fetch(obj.msgId)
}
