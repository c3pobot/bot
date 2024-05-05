'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const readFiles = require('./readFiles')
const getCmdArray = async(dir, dbKey)=>{
  try{
    const cmdArray = await readFiles(dir, dbKey)
    if(cmdArray){
      await mongo.rep('slashCmds', {_id: dbKey}, cmdArray)
      log.info('saved '+dbKey+' cmds to mongo')
    }else{
      log.info('Did not find any commands. Will try again in 5 seconds')
      setTimeout(()=>getCmdArray(dir, dbKey), 5000)
    }
  }catch(e){
    log.error(e)
    setTimeout(()=>getCmdArray(dir, dbKey), 5000)
  }
}
module.exports = getCmdArray
