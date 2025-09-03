'use strict'
const log = require('logger')
const rpcClient = require('src/rpcClient')

let msgOpts = { private: new Set([]), vip: new Set([]) }, POD_NAME = process.env.POD_NAME || 'bot'

const getMsgOpts = async()=>{
  let data = await rpcClient.get('getMsgOpts')
  console.log(data)
  if(!data?.vip || !data?.private) return
  msgOpts.vip = new Set(data.vip || [])
  msgOpts.private = new Set(data.private || [])
  return true
}
const sync = async( notify )=>{
  try{
    let syncTime = 60
    let status = await getMsgOpts()
    if(status && !notify){
      log.info(`${POD_NAME} msgOpts updated...`)
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
module.exports = { msgOpts }
