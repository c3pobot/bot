'use strict'
const log = require('logger');
const rabbitmq = require('src/helpers/rabbitmq')

let POD_NAME = process.env.POD_NAME || 'bot', NAME_SPACE = process.env.NAME_SPACE || 'default', SET_NAME = process.env.SET_NAME || 'bot', publisher, publisherReady
let EXCHANGE = process.env.SET_EXCHANGE || 'k8-status'
let ROUTING_KEY = process.env.BOT_SET_TOPIC || `statefulset.${NAME_SPACE}.${SET_NAME}`
const start = async()=>{
  try{
    if(!rabbitmq.ready){
      setTimeout(start, 5000)
      return
    }
    publisher = rabbitmq.createPublisher({ confirm: true, exchanges: [{ exchange: EXCHANGE, type: 'topic', durable: true, maxAttempts: 5 }]})
    publisherReady = true
    log.info(`${POD_NAME} ${ROUTING_KEY} publisher is ready...`)
  }catch(e){
    log.error(e)
  }
}
start()
module.exports.send = async(data = {})=>{
  if(!data?.type || !data?.namespace || !data?.name || !publisherReady) return
  await publisher.send({ exchange: EXCHANGE, routingKey: ROUTING_KEY }, data)
  return true
}
