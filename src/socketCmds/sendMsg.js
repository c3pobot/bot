'use strict'
const getChannel = require('./getChannel')
module.exports = async(obj = {}, bot)=>{
  try{
    if(!obj.chId || !obj.content) return
    let res = {status: 'error'}
    const channel = await getChannel(obj.chId)
    if(!channel) return {status: 'error', msg: 'Error getting channel '+obj.chId}
    return await channel.send(content)
  }catch(e){
    console.error(e);
  }
}
