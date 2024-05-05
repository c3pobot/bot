'use strict'
module.exports = async(obj = {}, bot)=>{
  if(!obj.msgId || !obj.chId || !obj.msg) return
  let msg = await getMsg(obj)
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
  return await msg.reply(obj.msg)
}
