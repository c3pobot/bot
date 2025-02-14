'use strict'
const log = require('logger')
const Cmds = {}

Cmds['setLogLevel'] = (data = {})=>{
  try{
    if(data?.logLevel){
      log.setLevel(data?.logLevel);
    }else{
      log.setLevel('info');
    }
  }catch(e){
    log.error(e)
  }
}
module.exports = (data)=>{
  try{
    if(!data) return
    if(Cmds[data?.routingKey]) Cmds[data.routingKey](data)
    if(Cmds[data?.cmd]) Cmds[data.cmd](data)
  }catch(e){
    log.error(e)
  }
}
