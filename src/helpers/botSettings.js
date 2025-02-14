'use strict'
const log = require('logger')
const rpcClient = require('src/rpcClient')

let botSettings = { }, POD_NAME = process.env.POD_NAME || 'bot'

const getBotSettings = async()=>{
  let data = await rpcClient.get('getBotSettings')
  if(!data) return
  for(let i in data) botSettings[i] = data[i]
  return true
}
const sync = async( notify )=>{
  try{
    let syncTime = 60
    let status = await getBotSettings()
    if(status && !notify){
      log.info(`${POD_NAME} botSettings updated...`)
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
module.exports = { botSettings }
