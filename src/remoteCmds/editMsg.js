'use strict'
const log = require('logger')
const reportBotError = require('src/helpers/reportBotError')
const perms = ['ManageMessages', 'SendMessages', 'ViewChannel']
const checkBlackList = require('src/helpers/checkBlackList')

module.exports = async(obj = {}, bot)=>{
  try{
    if(!obj.msg && obj.content) obj.msg = { content: obj.content }
    if(!obj.msgId || !obj.chId || !obj.msg) return
    let blackListed = await checkBlackList(obj.chId)
    if(blackListed){
      log.debug(`channel ${obj.chId} is blackListed`)
      return
    }
    blackListed = await checkBlackList(obj.msgId)
    if(blackListed){
      log.debug(`messaage ${obj.msgId} is blackListed`)
      return
    }

    let channel = bot?.channels?.cache?.get(obj.chId)
    if(!channel) channel = await bot?.channels?.fetch(obj.chId)
    if(!channel) throw(`error getting ch ${obj.chId}`)

    let hasPerm = true
    for(let i in perms){
      if(!hasPerm) break;
      hasPerm = channel.permissionsFor(channel.guild?.members?.me)?.has(perms[i])
      if(!hasPerm) throw(`missing ${perms[i]} for ch ${obj.chId}`)
    }
    if(!hasPerm) return

    let msg = channel.messages?.cache?.get(obj.msgId)
    if(!msg) msg = await channel.messages?.fetch(obj.msgId)
    if(!msg) throw(`error getting msg ${obj.msgId} in ch ${obj.chId}`)

    return await msg.edit(obj.msg)
  }catch(e){
    reportBotError(obj, e)
  }
}
