'use strict'
const log = require('logger')
const { msgOpts } = require('helpers/msgOpts')
const BOT_OWNER_ID = process.env.BOT_OWNER_ID
const BOT_STALKER_ID = process.env.BOT_STALKER_ID
const PRIVATE_BOT = +process.env.PRIVATE_BOT || false
module.exports.CheckBasicAllowed = (msg, usr = null)=>{
  try{
    if(PRIVATE_BOT) return true;
    if(msgOpts?.vip?.filter(x=>x === msg?.author?.id).length > 0) return true;
    if(msgOpts?.basic?.filter(x=>x === msg?.guild?.id || x === msg?.guildId).length > 0) return true;
    if(msgOpts?.private?.filter(x=>x === msg?.guild?.id || x === msg?.guildId).length > 0) return true;
    return;
  }catch(e){
    throw(e);
  }
}
module.exports.CheckPrivateAllowed = (msg)=>{
  try{
    if(PRIVATE_BOT) return true;
    if(msg.author.id === BOT_OWNER_ID) return true;
    if(msg.author.id === BOT_STALKER_ID) return true;
    if(msgOpts?.private?.filter(x=>x === msg?.guild?.id).length > 0) return true;
    if(msgOpts?.vip?.filter(x=>x === msg?.author?.id).length > 0) return true;
  }catch(e){
    throw(e);
  }
}
