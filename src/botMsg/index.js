'use strict'
const log = require('logger')

const bot = require('../bot')

const Cmds = {}
Cmds.sendMsg = require('./sendMsg')
Cmds.sendDM = require('./sendDM')
Cmds.editMsg = require('./editMsg')
Cmds.POST = require('./sendMsg')
Cmds.PATCH = require('./editMsg')

const botMsg = async(data = {})=>{
  try{
    if(!bot?.isReady() || !data.cmd) return
    if(data.podName && data.podName !== bot.podName) return
    if(Cmds[data.cmd]) return await Cmds[data.cmd](data)
  }catch(e){
    log.error(e)
  }
}
module.exports = async(data = {}, res)=>{
  try{
    let response = await botMsg(data)
    if(res){
      if(response){
        res.status(200).json(response)
      }else{
        res.sendStatus(400)
      }
    }
  }catch(e){
    log.error(e)
    if(res) res.sendStatus(400)
  }
}
