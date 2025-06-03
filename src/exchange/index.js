'use strict'
const log = require('logger')
const client = require('../rabbitmq/client')

const exchangeProcessor = require('./exchangeProcessor')

let POD_NAME = process.env.POD_NAME || 'bot'
let QUE_NAME = `xtopic.${POD_NAME}`, consumerStatus = false, NAME_SPACE = process.env.NAME_SPACE || 'default'

let exchanges = [{ exchange: `${NAME_SPACE}.cmds`, type: 'topic' }]
let queueBindings = [{ exchange: `${NAME_SPACE}.cmds`, queue: QUE_NAME }]

const processCmd = async(msg = {})=>{
  try{
    if(!msg.body) return
    let data = msg.body
    if(msg?.headers?.from_web_ui) data = JSON.parse(data)
    exchangeProcessor({...data,...{ routingKey: msg.routingKey, exchange: msg.exchange, timestamp: msg.timestamp }})
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
  log.info(`${POD_NAME} topic consumer created...`)
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
          log.info(`${POD_NAME} topic consumer started...`)
        }
      }
    }else{
      if(consumerStatus){
        consumerStatus = await stopConsumer()
        if(!consumerStatus) log.info(`${POD_NAME} topic consumer stopped...`)
      }
    }
    setTimeout(watch, 5000)
  }catch(e){
    log.error(e)
    setTimeout(watch, 5000)
  }
}
watch()
