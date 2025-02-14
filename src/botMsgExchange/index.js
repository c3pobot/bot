'use strict'
const log = require('logger')
const client = require('../rabbitmq/client')

const exchangeProcessor = require('./exchangeProcessor')

let POD_NAME = process.env.POD_NAME || 'bot'
let QUE_NAME = `xbotMsg.${POD_NAME}`, consumerStatus = false

let exchanges = [{ exchange: `bot.msg`, type: 'topic' }]
let queueBindings = [{ exchange: `bot.msg`, queue: QUE_NAME, routingKey: POD_NAME }]

const processCmd = async(msg = {}, reply)=>{
  try{
    if(!msg.body) return
    log.debug(`Recieved topic msg ${msg.routingKey} on ${msg.exchange}...`)
    exchangeProcessor({...msg.body,...{ routingKey: msg.routingKey, exchange: msg.exchange, timestamp: msg.timestamp }}, reply)
  }catch(e){
    log.error(e)
  }
}
let consumer = client.createConsumer({
  consumerTag: POD_NAME,
  queue: QUE_NAME,
  lazy: true,
  exchanges: exchanges,
  queueBindings: queueBindings,
  queueOptions: { queue: QUE_NAME, durable: false, arguments: { 'x-message-ttl': 5 * 60 * 1000 } }
}, processCmd)

consumer.on('error', (err)=>{
  log.error(err)
})
consumer.on('ready', ()=>{
  log.info(`${POD_NAME} msg consumer created...`)
})

const stopConsumer = async()=>{
  try{
    await consumer.close()
  }catch(e){
    log.error(e)
  }
}
const startConsumer = async()=>{
  try{
    await stopConsumer()
    let status = client.ready
    if(!status) return
    await consumer.start()
    return true
  }catch(e){
    log.error(e)
  }
}
const watch = async() =>{
  try{
    if(client.ready){
      if(!consumerStatus){
        consumerStatus = await startConsumer()
        if(consumerStatus){
          log.info(`${POD_NAME} msg consumer started...`)
        }
      }
    }else{
      if(consumerStatus){
        consumerStatus = await stopConsumer()
        if(!consumerStatus) log.info(`${POD_NAME} msg consumer stopped...`)
      }
    }
    setTimeout(watch, 5000)
  }catch(e){
    log.error(e)
    setTimeout(watch, 5000)
  }
}
module.exports.start = ()=>{
  watch()
}
