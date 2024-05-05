'use strict'
module.exports = async(member, chId, msg, bot)=>{
  let channel = await bot?.channels?.fetch(chId)
  if(!channel) return;
  let msg2send = msg.replace(/%user%/g, '<@'+member?.user?.id+'>')
  channel.send({content: msg2send})
}
