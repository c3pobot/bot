const log = require('logger')
const getChannel = require('./getChannel')
module.exports = async(obj = {}, bot)=>{
  try{
    if(!obj.msg) return
    let channel = await getChannel(obj, bot)
    if(!channel) return
    let hasPerm = channel.permissionsFor(channel?.guild?.me)?.has('SEND_MESSAGES')
    if(!hasPerm) return
    channel.send(obj.msg)
  }catch(e){
    log.error(e)
  }
}
