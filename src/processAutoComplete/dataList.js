'use strict'
const log = require('logger')
const rpcClient = require('src/rpcClient')

let dataList = {
  nameKeys: {},
  autoObj: {}
}
let POD_NAME = process.env.POD_NAME || 'bot'
const getAutoComplete = async()=>{
  let data = await rpcClient.get('getAutoComplete')
  if(!data?.nameKeys) return
  dataList.nameKeys = data.nameKeys
  dataList.autoObj = data.autoObj
  if(dataList.gameVersion !== data.gameVersion){
    dataList.gameVersion = data.gameVersion
    log.info(`updated dataList to ${dataList.gameVersion}...`)
  }
  return true
}
const sync = async(notify)=>{
  try{
    let syncTime = 60
    let status = await getAutoComplete()
    if(status && !notify){
      log.info(`${POD_NAME} dataList updated...`)
      notify = true
    }
    if(!status) syncTime = 5
    setTimeout(()=>sync(notify), syncTime * 1000)
  }catch(e){
    log.error(e)
    setTimeout(()=>sync(notify), 5000)
  }
}
sync()
module.exports = { dataList }
