'use strict'
const log = require('logger')
const rabbitmq = require('./helpers/rabbitmq')
const { msgOpts } = require('./helpers/msgOpts')

let WORKER_QUE_NAME_SPACE = process.env.WORKER_QUE_NAME_SPACE || process.env.NAME_SPACE || 'default'
let queues = [ 'swgoh', 'discord', 'oauth', 'tw-guild'], publisher, publisherReady
if(process.env.WORKER_QUES) queues = JSON.parse(process.env.WORKER_QUES)
let PRIVATE_QUES = process.env.PRIVATE_QUES || false, POD_NAME = process.env.POD_NAME || 'bot'
let queSet = new Set()


module.exports.start = ()=>{
  let payload = { confirm: true, queues: [{queue: `${WORKER_QUE_NAME_SPACE}.worker.assets`, durable: true, arguments: { 'x-queue-type': 'quorum', 'x-message-ttl': 600000 }}] }
  for(let i in queues){
    payload.queues.push({ queue: `${WORKER_QUE_NAME_SPACE}.worker.${queues[i]}`, arguments: { 'x-message-ttl': 600000 }})
    if(PRIVATE_QUES) payload.queues.push({ queue: `${WORKER_QUE_NAME_SPACE}.worker.${queues[i]}.private`, arguments: { 'x-message-ttl': 600000 }})
  }
  let tempSet = new Set(payload.queues.map(x=>x.queue))
  queSet = tempSet
  publisher = rabbitmq.createPublisher(payload)
  publisherReady = true
  log.info(`rabbitmq publisher on ${POD_NAME} started...`)
  return true
}
module.exports.add = async(queName, data = {})=>{
  if(!publisher) return
  let key = `${WORKER_QUE_NAME_SPACE}.worker.${queName}`
  if(PRIVATE_QUES && msgOpts?.private?.has(data.guild_id) && queSet.has(`${WORKER_QUE_NAME_SPACE}.worker.${queName}.private`)) key += '.private'
  await publisher.send(key, data)
  return true
}
