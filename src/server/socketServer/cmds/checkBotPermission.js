'use strict'
module.exports = async(channel, perm)=>{
  try{
    if(!channel || !perm) return
    const res = await channel.guild?.members?.me.permissionsIn(channel)?.toArray()
    if(res?.filter(x=>x === 'ViewChannel').length === 0) return
    if(res?.filter(x=>x === perm).length > 0) return true
  }catch(e){
    console.error(e);
  }
}
