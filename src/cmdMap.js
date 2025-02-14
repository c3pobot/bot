'use strict'
const log = require('logger')
const rpcClient = require('src/rpcClient')

let cmdMap = {}, POD_NAME = process.env.POD_NAME || 'bot'
const getCmdMap = async()=>{
  let data = await rpcClient.get('getCmdMap')
  if(!data) return
  for(let i in data) cmdMap[i] = data[i]
  return true
}
const sync = async(notify)=>{
  try{
    let syncTime = 60
    let status = await getCmdMap()
    if(status && !notify){
      log.info(`${POD_NAME} cmdMap updated...`)
      notify = true
    }
    if(!status) syncTime = 5
    setTimeout(()=>sync(notify), syncTime * 1000)
  }catch(e){
    log.error(e)
    setTimeout(()=>sync(notify), 5000)
  }
}

sync()
module.exports = { cmdMap }
