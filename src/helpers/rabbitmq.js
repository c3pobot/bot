'use strict'
const log = require('logger');
const rabbitmq = require('rabbitmq-client');

const POD_NAME = process.env.POD_NAME || 'bot'
const connectOptions = {
  hostname: process.env.MESSAGE_BUS_HOST || 'rabbitmq-cluster.datastore',
  port: +process.env.MESSAGE_BUS_PORT || 5672,
  username: process.env.MESSAGE_BUS_USER,
  password: process.env.MESSAGE_BUS_PASS,
}
const client = new rabbitmq.Connection(connectOptions)
client.on('error', (err)=>{
  log.error(`${POD_NAME} rabbitmq error...`)
  log.error(err)
})
client.on('connection', ()=>{
  log.info(`${POD_NAME} rabbitmq client connection successfully (re)established`)
})

module.exports = client
