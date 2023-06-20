'use strict'
module.exports = async(member, chId, msg)=>{
  try{
    const channel = await bot.channels.fetch(chId)
    if(!channel) return;
    const msg2send = msg.replace(/%user%/g, '<@'+member?.user?.id+'>')
    channel.send({content: msg2send})
  }catch(e){
    console.error(e);
  }
}
