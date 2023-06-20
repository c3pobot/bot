'use strict'
const queryGuild = require('./queryGuild')
module.exports = async(obj = {}, content)=>{
  try{
    if(!obj.sId || !obj.roleId) return;
    const guild = await queryGuild(obj.sId)
    if(!guild) return;
    let role = await guild?.roles?.cache?.get(obj.roleId)
    if(!role) role = await guild?.roles?.fetch(obj.roleId)
    return role
  }catch(e){
    console.error(e)
  }
}
