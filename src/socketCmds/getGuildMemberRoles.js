'use strict'
const queryGuild = require('./queryGuild')
module.exports = async(obj = {}, bot)=>{
  try{
    if(!obj.sId || !obj.dId) return;
    const guild = await queryGuild(obj, bot)
    if(!guild) return
    const usr = await guild.members.fetch(obj.dId)
    if(!usr) return
    const roles = guildUser.roles?.cache?.map(x=>x.id)
    return roles
  }catch(e){
    console.error(e);
  }
}
