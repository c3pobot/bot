'use strict'
const log = require('logger');
const rabbitmq = require('rabbitmq-client');

const POD_NAME = process.env.POD_NAME || 'bot'
const connectOptions = {
  hostname: process.env.MESSAGE_BUS_HOST || 'rabbitmq',
  port: +process.env.MESSAGE_BUS_PORT || 5672,
  username: process.env.MESSAGE_BUS_USER,
  password: process.env.MESSAGE_BUS_PASS,
  connectionName: POD_NAME
}
const client = new rabbitmq.Connection(connectOptions)
client.on('error', (err)=>{
  log.error(err)
})
client.on('connection', ()=>{
  log.info(`${POD_NAME} rabbitmq client connected...`)
})

module.exports = client
