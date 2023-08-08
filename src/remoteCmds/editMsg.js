'use strict'
const getMsg = require('./getMsg')

const POD_NAME = process.env.POD_NAME

module.exports = async(obj = {}, bot)=>{
  try{

    if(!obj.msgId || !obj.chId || (!obj.content && !obj.msg)) return
    if(obj.content && !obj.msg){
      obj.msg = obj.content
      if(typeof obj.msg != 'object' && typeof obj.msg == 'string') obj.msg = {content: obj.msg}
    }
    let msg = await getMsg(obj, bot)
    if(!msg) return { status: 'error', msg: 'Error getting message '+obj.msgId }
    if(obj.file || obj.files){
      obj.msg.files = []
      if(obj.file) obj.msg.files.push({attachment: Buffer.from(obj.file, 'base64'), name: obj.filename})
      if(obj.files){
        for(let i in obj.files) obj.msg.files.push({attachment: Buffer.from(obj.files[i].file, 'base64'), name: obj.files[i].filename})
      }
      delete obj.file
      delete obj.files
    }
    return await msg.edit(obj.msg)
  }catch(e){
    log.error(`pod: ${POD_NAME}, method: editMsg, sId: ${obj.sId}, chId : ${obj.dId}, msgId : ${obj.msgId}`)
    throw(e)
  }
}
