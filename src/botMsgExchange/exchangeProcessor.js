'use strict'
const log = require('logger')

let botMsg = require('src/botMsg')

let POD_NAME = process.env.POD_NAME || 'bot'
const Cmds = {}

Cmds[POD_NAME] = botMsg

module.exports = (data)=>{
  try{
    if(!data) return
    if(Cmds[data?.routingKey]) Cmds[data.routingKey](data)
  }catch(e){
    log.error(e)
  }
}
