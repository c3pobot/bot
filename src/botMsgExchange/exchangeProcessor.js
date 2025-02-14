'use strict'
const log = require('logger')

let botMsg = require('src/botMsg')

let POD_NAME = process.env.POD_NAME || 'bot'
const Cmds = {}

Cmds[POD_NAME] = botMsg

const rpcCall = require('src/rpcCmd')

module.exports = async(data, reply)=>{
  try{
    if(!data) return
    if(data?.rpcCall){
      let res = await rpcCall(data)
      if(res) reply(res)
    }
    if(Cmds[data?.routingKey]) Cmds[data.routingKey](data)
  }catch(e){
    log.error(e)
    if(data?.rpcCall) reply()
  }
}
