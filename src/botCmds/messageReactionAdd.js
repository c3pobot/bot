'use strict'
const { CheckBasicAllowed } = require('./messageCreate/checkAllowed')
const Translate = require('./messageCreate/translate')
module.exports = async(obj = {}, bot)=>{
  try{

    if(!obj.reaction || !obj.usr || obj.usr.bot || !bot) return;
    let channel = await bot.channels?.fetch(obj.reaction?.message?.channelId)
    if(!channel) return
    let msg = await channel.messages.fetch(obj.reaction?.message?.id)
    if(!msg) return
    let auth = await CheckBasicAllowed(msg)
    if(!auth) return;
    Translate(msg, obj.usr, obj.reaction?.emoji?.name)
  }catch(e){
    throw(e);
  }
}
