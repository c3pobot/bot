'use strict'
const log = require('logger')

const bot = require('../bot')
const blacklist = require('./blacklist')

module.exports = async(chId)=>{
  try{
    if(!chId) return
    let blacklisted = blacklist.check(chId)
    if(blacklisted){
      log.debug(`channel ${chId} is blacklisted...`)
      return
    }
    let channel = bot?.channels?.cache?.get(chId)
    if(!channel) channel = await bot?.channels?.fetch(chId)
    return channel
    /*
    let perms = channel.permissionsFor(channel.guild?.members?.me)?.has('ViewChannel')
    if(!perms){
      log.debug(`bot does not have permission to view channel ${chId}`)
      return
    }
    perms = channel.permissionsFor(channel.guild?.members?.me)?.has('SendMessages')
    if(!perms){
      log.debug(`bot does not have permission to send in channel ${chId}`)
      return
    }

    return channel
    */
  }catch(e){
    log.error(e)
  }
}
