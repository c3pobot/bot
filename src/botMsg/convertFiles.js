'use strict'
const checkForFiles = (data = {}, res = [])=>{
  try{
    if(data.file && (data.filename || data.fileName)) res.push({ attachment: Buffer.from(data.file, 'base64'), name: data.filename || data.fileName })
    if(data.files){
      for(let i in data.files){
        if(data.files[i].file && (data.files[i].filename || data.files[i].fileName)) res.push({ attachment: Buffer.from(data.files[i].file, 'base64'), name: data.files[i].filename || data.files[i].fileName  })
      }
    }
  }catch(e){
    throw(e)
  }
}
module.exports = (data = {})=>{
  try{
    let res = []
    checkForFiles(data, res)
    checkForFiles(data.msg, res)
    delete data.msg?.file
    delete data.msg?.filename
    delete data.msg?.fileName
    return res
  }catch(e){
    throw(e)
  }
}
