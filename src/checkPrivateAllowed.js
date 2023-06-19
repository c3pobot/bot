'use strict'
module.exports = async(msg)=>{
  try{
    let auth = 0
    if(+process.env.PRIVATE_BOT > 0) auth++;
    if(usr.id == process.env.BOT_OWNER_ID) auth++;
    if(usr.id == process.env.BOT_STALKER_ID) auth++;
    if(auth) return auth;
    if(basicCmdAllowedServers.filter(x=>x == msg.message.guild.id).length > 0) auth++;
    if(privateCr.filter(x=>x == msg.author.id).length > 0) auth++;
    return auth
  }catch(e){
    console.error(e);
  }
}
