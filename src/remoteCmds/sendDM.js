'use strict'
const log = require('logger')
const getMember = require('./getMember')
module.exports = async(obj = {}, bot)=>{
  try{
    if(!obj.dId || (!obj.content && !obj.msg)) return
    let usr = await getMember(obj, bot)
    if(!usr){
      return {status: 'error', msg: 'Error getting member '+obj.dId}
    }
    if(usr.error) throw(usr.error)
    if(obj.file || obj.files){
      obj.msg.files = []
      if(obj.file) obj.msg.files.push({attachment: Buffer.from(obj.file, 'base64'), name: obj.filename})
      if(obj.files){
        for(let i in obj.files) obj.msg.files.push({attachment: Buffer.from(obj.files[i].file, 'base64'), name: obj.files[i].filename})
      }
      delete obj.file
      delete obj.files
    }
    return await usr.send(obj.msg || obj.content)
  }catch(e){
    throw(e);
  }
}
