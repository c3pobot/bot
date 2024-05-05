'use strict'
const translate = require('src/helpers/translate')

module.exports = async(msg, bot)=>{
  if(!msg?.reference || !msg?.content?.toLowerCase()?.startsWith('translate')) return;
  let channel = await bot?.channels?.fetch(msg?.reference?.channelId)
  if(!channel) return
  let msgRef = await channel?.messages?.fetch(msg?.reference?.messageId)
  if(!msgRef) return
  translate(msgRef)
}
