'use strict'
const mongo = require('mongoclient')
const log = require('logger')
let workerTypes = ['discord', 'oauth', 'swgoh']
if(process.env.WORKER_TYPES) workerTypes = JSON.parse(process.env.WORKER_TYPES)

let cmdMap = {}
const addWorkerCmds = async(workerType)=>{
  if(!workerType) return
  let obj = (await mongo.find('slashCmds', { _id: workerType }))[0]
  if(!obj?.cmdMap) return
  for(let i in obj.cmdMap) cmdMap[i] = obj.cmdMap[i]
  return true
}
const update = async(notify = false)=>{
  let status = true
  for(let i in workerTypes){
    if(!status) break
    status = await addWorkerCmds(workerTypes[i])
    if(notify) log.info(`${workerTypes[i]} added to cmdMap...`)
  }
  if(status) cmdMap.cmdMapReady = true
  return true
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
const start = ()=>{
  try{
    let status = mongo.status()
    if(status){
      syncMap(true)
      return
    }
    setTimeout(start, 5000)
  }catch(e){
    log.error(e)
    setTimeout(start, 5000)
  }
}
start()
module.exports = { cmdMap }
