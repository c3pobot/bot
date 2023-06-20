'use strict'
const express = require('express')
const bodyParser = require('body-parser');
const compression = require('compression');
const http = require('http')
const PORT = process.env.HEALTH_PORT || 3001
const SHARD_NUM = +process.env.SHARD_NUM
const app = express()
const Msg = require('./msg')
app.use(bodyParser.json({
  limit: '500MB',
  verify: (req, res, buf)=>{
    req.rawBody = buf.toString()
  }
}))
app.use(compression());
const server = http.createServer(app)
server.listen(PORT, ()=>{
  console.log('bot-'+SHARD_NUM+' is listening on '+PORT+'...')
})
app.use(express.json({limit: '100MB'}))
app.get('/healthz', (req, res)=>{
  res.json({res: 'ok'}).status(200)
})
require('./socketServer')(server)
