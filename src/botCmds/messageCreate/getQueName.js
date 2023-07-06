'use strict'
const USE_PRIVATE = process.env.USE_PRIVATE_WORKERS || false
module.exports = async(msg, msgOpts)=>{
  try{
    let res = 'discord'
    if(msgOpts.private?.filter(x=>x === msg?.guild?.id).length > 0 && USE_PRIVATE) res = 'discordPrivate'
    return res
  }catch(e){
    throw(e);
  }
}
