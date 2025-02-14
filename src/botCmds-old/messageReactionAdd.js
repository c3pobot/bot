'use strict'
const { checkBasicAllowed } = require('src/helpers/checkAllowed')
const translate = require('src/helpers/translate')
module.exports = async(obj = {}, bot)=>{
  if(!obj.reaction || !obj.usr || obj.usr.bot || !bot) return;

  let channel = await bot.channels?.fetch(obj.reaction?.message?.channelId)
  if(!channel) return

  let msg = await channel.messages.fetch(obj.reaction?.message?.id)
  if(!msg) return

  let auth = checkBasicAllowed(msg)
  if(!auth) return;
  //translate(msg, obj.reaction?.emoji?.name)
}
