'use strict'
const log = require('logger')
const mongo = require('mongoclient')

let blackList = new Set()

const init = async()=>{
  try{
    if(!mongo?.ready){
      setTimeout(init, 5000)
      return
    }
    let obj = await mongo.find('blackList', {}, { _id: 1})
    if(!obj){
      setTimeout(init, 5000)
      return
    }
    if(obj.length === 0) return
    blackList = new Set(obj.map(x=>x._id))
    log.debug(`loaded ${obj.length} ids to the blackList...`)
  }catch(e){
    log.error(e)
    setTimeout(init, 5000)
  }
}
const add = (id, data = {})=>{
  try{
    if(!id) return
    blackList.add(id)
    mongo.set('blackList', { _id: id }, data)
  }catch(e){
    log.error(e)
  }
}
module.exports.check = (id)=>{
  try{
    return blackList?.has(id)
  }catch(e){
    log.error(e)
  }
}
module.exports.add = add
module.exports.report = (obj = {}, err)=>{
  try{
    if(err?.message){
      if(err?.message?.toLowerCase()?.includes('channel') && obj.chId){
        add(obj.chId, obj)
        log.info(`bot blackListed channel ${obj.chId}...`)
      }
      if(err?.message?.toLowerCase()?.includes('message') && obj.msgId){
        add(obj.msgId, obj)
        log.info(`bot blackListed message ${obj.msgId}...`)
      }
      if(err?.message?.toLowerCase()?.includes('cannot send messages to this user') && obj.dId){
        add(obj.dId, obj)
        log.info(`bot blackListed user ${obj.dId}...`)
      }
    }
    if(err) log.error(err)
  }catch(e){
    log.error(e)
  }
}
