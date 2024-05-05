'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const { dataList } = require('./dataList')

const updateNameKeys = async()=>{
  let obj = (await mongo.find('autoComplete', {_id: 'nameKeys'}))[0]
  if(obj?.data) dataList.nameKeys = obj.data
}
const updateAutoObj = async()=>{
  let obj = await mongo.find('autoComplete', {include: true}, {_id: 1, data: {name: 1, value: 1}})
  if(obj.length > 0){
    let tempObj = {}
    for(let i in obj){
      if(obj[i]?.data) tempObj[obj[i]._id] = obj[i].data
    }
    dataList.autoObj = tempObj
  }
}
const update = async()=>{
  let status = mongo.status()
  if(status){
    await updateAutoObj()
    await updateNameKeys()
    return true
  }
}
const start = async(data)=>{
  try{
    let status = await update()
    if(status){
      let msg = 'Updated dataList'
      if(data?.gameVersion) msg += ` to gameVersion ${data.gameVersion}...`
      log.info(msg)
      return
    }
    setTimeout(()=>start(data), 5000)
  }catch(e){
    log.error(e)
    setTimeout(()=>start(data), 5000)
  }
}
start()
module.exports = start
