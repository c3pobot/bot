'use strict'
module.exports = async(obj, msg2send = { content: 'Here we go again...', components: [] })=>{
  if(!obj?.message) return
  await obj.message?.edit(msg2send)
}
