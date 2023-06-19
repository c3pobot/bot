'use strict'
module.exports = async(msg, usr = null)=>{
  try{
    if(+process.env.PRIVATE_BOT > 0) return 1;
    //if(usr.id == process.env.BOT_OWNER_ID) auth++;
    if(msgOpts?.vip?.filter(x=>x === msg?.author?.id).length > 0) return 1;
    if(msgOpts?.basic?.filter(x=>x == msg?.guild?.id || x == msg?.guildId).length > 0) return 1;
    if(msgOpts?.private?.filter(x=>x == msg?.guild?.id || x == msg?.guildId).length > 0) return 1;
    return;
  }catch(e){
    console.error(e);
  }
}
