'use strict'
const log = require('logger')
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const PORT = process.env.PORT || 3001
const POD_NAME = process.env.POD_NAME
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
const server = app.listen(PORT, ()=>{
  log.info(POD_NAME+' is listening on '+server.address().port)
})
