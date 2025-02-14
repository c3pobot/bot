'use strict'
const log = require('logger')
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const remoteCmds = require('./remoteCmds');
const botMsg = require('./botMsg');

const POD_NAME = process.env.POD_NAME || 'bot', SHARD_NUM = +(process.env.POD_INDEX || 0), NUM_SHARDS = +(process.env.NUM_SHARDS || 1)

const app = express()
app.use(bodyParser.json({
  limit: '500MB',
  verify: (req, res, buf)=>{
    req.rawBody = buf.toString()
  }
}))
app.use(compression());

const server = app.listen(process.env.PORT || 3000, ()=>{
  log.info(`${POD_NAME} is listening on port ${server.address().port}`)
});

app.get('/getNumShards', (req, res)=>{
  res.status(200).json({ totalShards: NUM_SHARDS, myShard: SHARD_NUM })
})
app.get('/healthz', (req, res)=>{
  if(botStatus){
    res.sendStatus(200)
    return
  }
  res.status(400)
})
app.get('/', (req, res)=>{
  res.status(200).json({ totalShards: NUM_SHARDS, myShard: SHARD_NUM })
})

app.post('/cmd', (req, res)=>{
  remoteCmds(req?.body, res)
})

app.post('/msg', (req, res)=>{
  botMsg(req?.body, res)
})
