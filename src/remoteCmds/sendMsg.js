'use strict'
const log = require('logger')
const getChannel = require('./getChannel')

const POD_NAME = process.env.POD_NAME

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
    log.error(`pod: ${POD_NAME}, method: sendMsg, sId: ${obj.sId}, chId : ${obj.chId}`)
    throw(e);
  }
}
