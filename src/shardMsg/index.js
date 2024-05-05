'use strict'
const Cmds = {}
const send = require('./send')
const edit = require('./edit')
const dm = require('./dm')
module.exports = (obj = {}, bot)=>{
  if(!bot) return
  if(Cmds[obj.cmd]) Cmds[obj.cmd](obj, bot)
}
