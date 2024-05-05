'use strict'
module.exports = async(channel, perm)=>{
  if(!channel || !perm) return
  return await channel?.permissionsFor(channel.guild?.me).has(perm)
}
