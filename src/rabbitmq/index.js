'use strict'
const log = require('logger')

const client = require('./client')
const { msgOpts } = require('../helpers/msgOpts')

let POD_NAME = process.env.POD_NAME || 'bot', NAME_SPACE = process.env.NAME_SPACE || 'default', PRIVATE_QUES = process.env.PRIVATE_QUES || false
let DEFAULT_EXCHANGE = `${NAME_SPACE}.cmds`, NUM_SHARDS = +(process.env.NUM_SHARDS || 1)
let queNames = [ 'swgoh', 'discord', 'oauth', 'tw-guild'], queSet, publisher, publisherReady, cmdCount = 0
if(process.env.WORKER_QUES) queNames = JSON.parse(process.env.WORKER_QUES)

let queues = [{ queue: `worker.runner`, arguments: { 'x-message-ttl': 600000 }}]
let exchanges = [{ exchange: DEFAULT_EXCHANGE, type: 'topic', maxAttempts: 5 }]

const start = ()=>{
  try{
    for(let i in queNames){
      queues.push({ queue: `worker.${queNames[i]}`, arguments: { 'x-message-ttl': 600000 }})
      queues.push({ queue: `worker.${queNames[i]}.private`, arguments: { 'x-message-ttl': 600000 }})
    }
    queSet = new Set(queues.map(x=>x.queue))
    publisher = client.createPublisher({ exchanges: exchanges, queues: queues })
    publisher.on('close', ()=>{
      log.info(`${POD_NAME} topic exchange publisher disconnected...`)
      log.info(`${POD_NAME} queue publisher disconnected...`)
    })
    log.info(`${POD_NAME} topic exchange publisher created...`)
    log.info(`${POD_NAME} queue publisher created...`)
  }catch(e){
    log.error(e)
    setTimeout(start, 5000)
  }
}
start()

module.exports = {
  get status(){
    return client?.ready
  }
}
module.exports.add = async(queName, payload)=>{
  try{
    if(!queName || !payload || !payload?.id || !client.ready) return
    let key = `worker.${queName}`
    if(msgOpts?.private?.has(payload.guild_id) && queSet.has(`worker.${queName}.private`) && queName !== 'runner') key += '.private'
    await publisher.send ({ routingKey: key }, payload)
    return true
  }catch(e){
    if(e?.message?.includes('message rejected by server')) return true
    log.error(e)
  }
}
module.exports.notify = async( data, routingKey, exchange )=>{
  try{
    if(!data || !client.ready) return
    if(!exchange) exchange = DEFAULT_EXCHANGE
    await publisher.send({ exchange: exchange, routingKey: routingKey }, data)
    return true
  }catch(e){
    log.error(e)
  }
}
