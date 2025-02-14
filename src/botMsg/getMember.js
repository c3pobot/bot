'use strict'
const log = require('logger')

const bot = require('../bot')
const blacklist = require('./blacklist')

const getGuildMember = async(sId, dId)=>{
  try{
    if(!sId || !dId) return
    let guild = bot?.guilds?.cache?.get(sId)
    if(!guild) guild = await bot?.guilds?.fetch(sId)
    if(!guild) return

    let member = guild?.members?.cache?.get(dId)
    if(!member) member = await guild?.members?.fetch(dId)
    return member
  }catch(e){
    log.error(e)
  }
}
module.exports = async(data = {})=>{
  try{
    let blacklisted = blacklist.check(data.dId)
    if(blacklisted){
      log.debug(`user ${data.dId} is blacklisted...`)
      return
    }
    let member = await getGuildMember(data.sId, data.dId)
    if(member) return member

    if(!bot?.podName || data.podName !== bot.podName) return

    member = bot?.users?.cache?.get(data.dId)
    if(!member) member = await bot?.users?.fetch(data.dId)
    return member
  }catch(e){
    log.error(e)
  }
}
