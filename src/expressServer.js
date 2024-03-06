'use strict'
const log = require('logger')
const { botSettings } = require('./helpers/botSettings')
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const app = express()
app.use(bodyParser.json({
  limit: '500MB',
  verify: (req, res, buf)=>{
    req.rawBody = buf.toString()
  }
}))
app.use(compression());
app.get('/healthz', (req, res)=>{
  res.status(200).json({res: 'ok'})
})
app.post('/logLevel', (req, res)=>{
  getLogLevel(req, res)
})
module.exports = app
const getLogLevel = async(req, res)=>{
  try{
    if(!req?.body?.setName) res.sendStatus(400)
    let logStatus = { logLevel: null }
    if(botSettings?.map?.logLevel && botSettings?.map?.logLevel[req.body.setName]) logStatus.logLevel = botSettings?.map?.logLevel[req.body.setName]
    res.status(200).json(logStatus)
  }catch(e){
    log.error(e)
    res.sendStatus(400)
  }
}
