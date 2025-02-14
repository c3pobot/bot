'use strict'
const log = require('logger')
const readFiles = require('./readFiles')
const rabbitmq = require('src/rabbitmq')

module.exports = async(dir, dbKey)=>{
  try{
    let cmdArray = await readFiles(dir, dbKey)
    if(cmdArray){
      let status = await rabbitmq.add('runner', { id: dbKey, cmd: 'saveBotCmds',  dbkey: dbKey, cmdArray: cmdArray })
      if(status){
        log.info('sent '+dbKey+' cmds to runner...')
        return true
      }

    }else{
      log.info('Did not find any commands. Will try again in 5 seconds')
    }
  }catch(e){
    log.error(e)
  }
}
