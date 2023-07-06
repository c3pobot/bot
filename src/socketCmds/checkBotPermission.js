'use strict'
module.exports = async(channel, perm)=>{
  try{
    if(!channel || !perm) return
    return await channel?.permissionsFor(channel.guild?.me).has(perm)
  }catch(e){
    console.error(e);
  }
}
