'use strict'
const BOT_OWNER_ID = process.env.BOT_OWNER_ID
const BOT_STALKER_ID = process.env.BOT_STALKER_ID
const PRIVATE_BOT = +process.env.PRIVATE_BOT || 0
module.exports.CheckBasicAllowed = async(msg, msgOpts, usr = null)=>{
  try{
    if(PRIVATE_BOT > 0) return 1;
    if(msgOpts?.vip?.filter(x=>x === msg?.author?.id).length > 0) return 1;
    if(msgOpts?.basic?.filter(x=>x === msg?.guild?.id || x === msg?.guildId).length > 0) return 1;
    if(msgOpts?.private?.filter(x=>x === msg?.guild?.id || x === msg?.guildId).length > 0) return 1;
    return;
  }catch(e){
    throw(e);
  }
}
module.exports.CheckPrivateAllowed = async(msg, msgOpts)=>{
  try{
    if(PRIVATE_BOT > 0) return 1;
    if(msg.author.id === BOT_OWNER_ID) return 1;
    if(msg.author.id === BOT_STALKER_ID) return 1;
    if(msgOpts?.private?.filter(x=>x === msg.message.guild.id).length > 0) return 1;
    if(msgOpts?.vip?.filter(x=>x === msg?.author?.id).length > 0) return 1;
  }catch(e){
    throw(e);
  }
}
