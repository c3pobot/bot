const log = require('logger')
const perms = ['SendMessages', 'ViewChannel']
const reportBotError = require('src/helpers/reportBotError')
const checkBlackList = require('src/helpers/checkBlackList')

module.exports = async(obj = {}, bot)=>{
  try{
    if(!obj.msg || !obj.chId) return
    let blackListed = await checkBlackList(obj.dId)
    if(blackListed){
      log.debug(`channel ${obj.chId} is blackListed`)
      return
    }

    let channel = bot?.channels?.cache?.get(obj.chId)
    if(!channel) channel = await bot?.channels?.fetch(obj.chId)
    if(!channel) throw(`error getting channel`)

    let hasPerm = true
    for(let i in perms){
      if(!hasPerm) break;
      hasPerm = channel.permissionsFor(channel.guild?.members?.me)?.has(perms[i])
      if(!hasPerm) throw(`missing ${perms[i]} permission`)
    }
    if(!hasPerm) return

    return await channel.send(obj.msg)
  }catch(e){
    reportBotError(obj, e)
  }
}
