'use strict'
const log = require('logger')
const Cmds = {}
Cmds.getNumShards = require('./getNumShards')
module.exports = async( data = {})=>{
  try{
    if(!data.cmd || !Cmds[data.cmd]) return
    return await Cmds[data.cmd](data)
  }catch(e){
    log.error(e)
  }
}
