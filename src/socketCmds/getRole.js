'use strict'
const queryGuild = require('./queryGuild')
module.exports = async(obj = {}, bot)=>{
  try{
    if(!obj.sId || !obj.roleId) return;
    const guild = await queryGuild(obj, bot)
    if(!guild) return;
    let role = await guild?.roles?.cache?.get(obj.roleId)
    if(!role) role = await guild?.roles?.fetch(obj.roleId)
    return role
  }catch(e){
    throw(e)
  }
}
