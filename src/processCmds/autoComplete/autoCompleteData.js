'use strict'
const log = require('logger')
const mongo = require('mongoapiclient')
let autoCompleteData = {
  nameKeys: {},
  autoObj: {}
}
const updateNameKeys = async()=>{
  try{
    let obj = (await mongo.find('autoComplete', {_id: 'nameKeys'}))[0]
    if(obj?.data) autoCompleteData.nameKeys = obj.data
  }catch(e){
    throw(e);
  }
}
const updateAutoObj = async()=>{
  try{
    let obj = await mongo.find('autoComplete', {include: true}, {_id: 1, data: {name: 1, value: 1}})
    if(obj.length > 0){
      let tempObj = {}
      for(let i in obj){
        if(obj[i]?.data) tempObj[obj[i]._id] = obj[i].data
      }
      autoCompleteData.autoObj = tempObj
    }
  }catch(e){
    throw(e)
  }
}
const update = async()=>{
  try{
    await updateAutoObj()
    await updateNameKeys()
    setTimeout(update, 30000)
  }catch(e){
    log.error(e);
    setTimeout(update, 5000)
  }
}
update()
module.exports = { autoCompleteData }
