'use strict'
const log = require('logger')
const reportBotError = require('src/helpers/reportBotError')
const checkBlackList = require('src/helpers/checkBlackList')
const perms = ['SendMessages', 'ViewChannel']

module.exports = async(obj = {}, bot)=>{
  try{
    if(!obj.msg && obj.content) obj.msg = { content: obj.content }
    if(!obj.dId || !obj.msg || !obj?.sId || !bot) return
    let blackListed = await checkBlackList(obj.dId)
    if(blackListed){
      log.debug(`user ${obj.dId} is blackListed`)
      return
    }

    let guild = bot.guilds?.cache?.get(obj.sId)
    if(!guild) guild = await bot.guilds?.fetch(obj.sId)
    if(!guild) throw(`error getting guild`)

    let member = guild.members?.cache?.get(obj.dId)
    if(member) member = await guild.members?.fetch(obj.dId)
    if(!member) throw(`error getting member`)

    await member.send(obj.msg)
  }catch(e){
    reportBotError(obj, e)
  }
}
