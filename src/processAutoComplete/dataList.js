'use strict'
const log = require('logger')
const mongo = require('mongoclient')

let notify = false, dataList = {
  nameKeys: {},
  autoObj: {}
}

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
const sync = async()=>{
  try{
    if(mongo.ready){
      await updateNameKeys()
      await updateAutoObj()
      if(!notify && status){
        notify = true
        log.info(`updated dataList...`)
      }
    }
    setTimeout(sync, 5000)
  }catch(e){
    setTimeout(sync, 5000)
  }
}
sync()
module.exports = { dataList }
