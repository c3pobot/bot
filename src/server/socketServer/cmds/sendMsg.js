'use strict'
const getChannel = require('./getChannel')
const checkBotPermission = require('./checkBotPermission')
module.exports = async(obj = {}, content)=>{
  try{
    if(!obj.chId || !content) return
    let res = {status: 'error'}, hasPerm
    const channel = await getChannel(obj)
    if(!channel) return {status: 'error', msg: 'Error getting channel '+obj.chId}
    if(channel) hasPerm = await checkBotPermission(channel, 'SendMessages')
    if(!hasPerm) return {status: 'error', msg: 'no permission to send messages to <#'+obj.chId+'>'}
    if(hasPerm) channel.send(content)
    return {status: 'ok'}
  }catch(e){
    console.error(e);
  }
}
