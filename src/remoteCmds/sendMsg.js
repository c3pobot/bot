'use strict'
const getChannel = require('./getChannel')
module.exports = async(obj = {}, bot)=>{
  try{
    if(!obj.chId || (!obj.content && !obj.msg)) return
    let res = {status: 'error'}
    let channel = await getChannel(obj, bot)
    if(!channel){
      return {status: 'error', msg: 'Error getting channel '+obj.chId}
    }
    return await channel.send(obj.msg || obj.content)
  }catch(e){
    throw(e);
  }
}
