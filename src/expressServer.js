'use strict'
const log = require('logger')
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
module.exports = app
