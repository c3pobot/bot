'use strict'
module.exports = (obj)=>{
  if(!obj) return
  let botId = obj?.client?.user?.id
  if(!botId) return
  return obj?.guild?.members?.cache?.get(botId)?.permissions?.toArray()
}
