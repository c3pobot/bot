'use strict'
const log = require('logger')

const bot = require('../bot')
const blacklist = require('./blacklist')
const convertFiles = require('./convertFiles')
const getMember = require('./getMember')

module.exports = async(data = {})=>{
  try{
    if(!bot?.isReady() || !bot?.podName || !data.dId || !data.msg) return
    let member = await getMember(data)
    if(!member) return

    if(data.file || data.files || data.msg.file || data.msg.files) data.msg.files = convertFiles(data)
    return await member?.send(data.msg)

  }catch(e){
    blacklist.report({ dId: data.dId }, e)
  }
}
