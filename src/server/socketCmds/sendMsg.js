'use strict'
const getChannel = require('./getChannel')
module.exports = async(obj = {}, content)=>{
  try{
    if(!obj.chId || !content) return
    let res = {status: 'error'}
    const channel = await getChannel(obj.chId)
    if(!channel) return {status: 'error', msg: 'Error getting channel '+obj.chId}
    channel.send(content)
    return {status: 'ok'}
  }catch(e){
    console.error(e);
  }
}
