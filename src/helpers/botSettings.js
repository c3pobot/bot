'use strict'
const log = require('logger')
const mongo = require('mongoapiclient')
let botSettings = { map: {} }
const update = async(notify = false)=>{
  try{
    let checkTime = 60, notifyUpdate = false
    let obj = (await mongo.find('botSettings', {_id: "1"}))[0]
    if(obj){
      botSettings.map = obj
      if(notify) log.info('botSettings updated...')
    }else{
      if(notify) notifyUpdate = true
      checkTime = 5
    }
    setTimeout(()=>update(notifyUpdate), checkTime * 1000)
  }catch(e){
    log.error(e);
    setTimeout(()=>update(notify), 5000)
  }
}
update(true)
module.exports = { botSettings }
