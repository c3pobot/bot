'use strict'
const queryGuild = require('./queryGuild')
module.exports = async(obj = {}, content)=>{
  try{
    if(!obj.dId || !obj.sId) return
    const guild = await queryGuild(obj)
    if(!guild) return
    let guildUser = await guild?.members?.fetch(obj.dId)
    if(!guildUser) return;
    return await guildUser?.user?.avatarURL({format: 'png', dynamic: true, size: 256})
  }catch(e){
    console.error(e)
  }
}
