'use strict'
const log = require('logger')
let workerTypes = ['discord', 'oauth', 'swgoh']
if(process.env.WORKER_TYPES) workerTypes = JSON.parse(process.env.WORKER_TYPES)
const mongo = require('mongoapiclient')
let CmdMap = { map: {} }
const update = async(notify = false)=>{
  try{
    let tempMap = {}
    for(let i in workerTypes){
      if(notify) log.info('Add '+workerTypes[i]+' commands...')
      let obj = (await mongo.find('slashCmds', {_id: workerTypes[i]}))[0]
      if(obj?.cmdMap) tempMap = {...tempMap,...obj.cmdMap}
    }
    let cmdCount = +Object.values(tempMap)?.length
    if(cmdCount > 0){
      tempMap.cmdCount = cmdCount
      CmdMap.map = tempMap
      if(notify) log.info('Saving map to CmdMap')
      return true
    }
  }catch(e){
    throw(e);
  }
}
const syncMap = async(notify = false)=>{
  try{
    if(notify) log.info('Creating command map...')
    let checkTime = 5, notifyUpdate = false
    if(notify) notifyUpdate = true
    let status = await update(notify)
    if(status){
      checkTime = 60
      notifyUpdate = false
    }
    setTimeout(()=>syncMap(notifyUpdate), checkTime * 1000)
  }catch(e){
    log.error(e);
    setTimeout(()=>syncMap(notify), 5000)
  }
}
syncMap(true)
module.exports = { CmdMap }
