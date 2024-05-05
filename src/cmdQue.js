'use strict'
const log = require('logger')
const rabbitmq = require('./helpers/rabbitmq')
const { msgOpts } = require('./helpers/msgOpts')

let WORKER_QUE_NAME_SPACE = process.env.WORKER_QUE_NAME_SPACE || 'default'
let queues = [ 'swgoh', 'discord', 'oauth'], publisher, publisherReady
if(process.env.WORKER_QUES) queues = JSON.parse(process.env.WORKER_QUES)
const PRIVATE_QUES = process.env.PRIVATE_QUES || false, POD_NAME = process.env.POD_NAME || 'bot'

module.exports.start = ()=>{
  let payload = { confirm: true, queues: [] }
  for(let i in queues){
    payload.queues.push({ queue: `${WORKER_QUE_NAME_SPACE}.worker.${queues[i]}`, durable: true, arguments: { 'x-queue-type': 'quorum', 'x-message-ttl': 600000 }})
    if(PRIVATE_QUES) payload.queues.push({ queue: `${WORKER_QUE_NAME_SPACE}.worker.${queues[i]}.private`, durable: true, arguments: { 'x-queue-type': 'quorum', 'x-message-ttl': 600000 }})
  }
  publisher = rabbitmq.createPublisher(payload)
  publisherReady = true
  return true
}
module.exports.add = async(queName, data = {})=>{
  if(!publisher) return
  let key = `${WORKER_QUE_NAME_SPACE}.worker.${queName}`
  if(PRIVATE_QUES && msgOpts?.private?.filter(x=>x === data.guild_id).length > 0) routingKey += '.private'
  await publisher.send(key, data)
  return true
}
