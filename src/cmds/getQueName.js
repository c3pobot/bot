'use strict'
let CmdQues = ['discord']
if(process.env.CMD_QUE_NAMES) CmdQues = JSON.parse(process.env.CMD_QUE_NAMES)
module.exports = async(msg, msgOpts)=>{
  try{
    let res = 'discord'
    if(msgOpts.private?.filter(x=>x === msg?.guild?.id).length > 0 && !process.env.PRIVATE_BOT){
      if(CmdQues.filter(x=>x === 'discordPrivate').length > 0) res = 'discordPrivate'
    }
    return res
  }catch(e){
    console.error(e);
  }
}
