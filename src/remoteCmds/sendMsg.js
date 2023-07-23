'use strict'
const log = require('logger')
const getChannel = require('./getChannel')
module.exports = async(obj = {}, bot)=>{
  try{
    log.debug(JSON.stringify(obj))
    if(!obj.chId || !obj.content) return
    let res = {status: 'error'}
    let channel = await getChannel(obj, bot)
    if(channel) log.debug(channel.id)
    if(!channel){
      log.debug('Error getting channel '+obj.chId)
      return {status: 'error', msg: 'Error getting channel '+obj.chId}
    }
    return await channel.send(obj.content)
  }catch(e){
    throw(e);
  }
}
