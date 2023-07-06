'use strict'
const { mongo, mongoStatus } = require('mongoapiclient')
let botSettings = {}, mongoReady = false
const updateBotSettings = async(notify = false)=>{
  try{
    let checkTime = 60, notifyUpdate = false
    if(!mongoReady){
      mongoReady = mongoStatus()
      if(!mongoReady){
        checkTime = 5
        if(notify) notifyUpdate = true
      }
    }
    if(mongoReady){
      let obj = (await mongo.find('botSettings', {_id: '1'}))[0]
      if(obj){
        botSettings = obj
        if(notify) console.log('botSettings updated ...')
      }
    }
    setTimeout(()=>updateBotSettings(notifyUpdate), checkTime * 1000)
  }catch(e){
    console.error(e);
    setTimeout(()=>updateBotSettings(notify), 5)
  }
}
updateBotSettings(true)
module.exports = ()=>{
  return botSettings
}
