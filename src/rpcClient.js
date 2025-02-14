'use strict'
const log = require('logger')
const rabbitmq = require('./rabbitmq/client')
let queues = [{ queue: `worker.runner`, arguments: { 'x-message-ttl': 600000 }}], rpcClient, POD_NAME = process.env.POD_NAME || 'bot'
const start = async()=>{
  try{
    if(rabbitmq?.ready){
      rpcClient = rabbitmq.createRPCClient({ queues: queues, timeout: 10000 })
      log.info(`${POD_NAME} rpcClient created...`)
      return
    }
    setTimeout(start, 5000)
  }catch(e){
    log.error(e)
    setTimeout(start, 5000)
  }
}
start()
module.exports = {
  get status(){
    return rpcClient?.active
  }
}
module.exports.get = async(cmd, payload = {})=>{
  try{
    if(!cmd || !rpcClient?.active) return
    let res = await rpcClient.send({ routingKey: `worker.runner`}, {...payload,...{ cmd: cmd, rpcCall: true }})
    return res?.body
  }catch(e){
    log.error(e)
  }
}
