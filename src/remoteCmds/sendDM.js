'use strict'
const log = require('logger')
const reportBotError = require('src/helpers/reportBotError')
const checkBlackList = require('src/helpers/checkBlackList')
const perms = ['SendMessages', 'ViewChannel']
const POD_NAME = process.env.POD_NAME
module.exports = async(obj = {}, bot)=>{
  try{

    if(!obj.msg && obj.content) obj.msg = { content: obj.content }
    if(!obj.dId || !obj.msg || !bot) return
    if(!obj.sId && obj.podName !== POD_NAME) return
    let blackListed = await checkBlackList(obj.dId)
    if(blackListed){
      log.debug(`user ${obj.dId} is blackListed`)
      return
    }
    let member
    if(obj.sId){
      let guild = bot.guilds?.cache?.get(obj.sId)
      if(!guild) guild = await bot.guilds?.fetch(obj.sId)
      if(!guild) throw(`error getting guild`)

      member = guild.members?.cache?.get(obj.dId)
      if(!member) member = await guild.members?.fetch(obj.dId)
    }else{
      member = bot.users?.cache?.get(obj.dId)
      if(!member) member = await bot.users?.fetch(obj.dId)
    }

    if(!member?.id) throw(`error getting member`)

    return await member?.send(obj.msg)
  }catch(e){
    reportBotError(obj, e)
  }
}
