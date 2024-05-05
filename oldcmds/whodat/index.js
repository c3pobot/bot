'use strict'
const Cmds = {}
Cmds.channel = require('./channel')
Cmds.guild = require('./guild')
Cmds.user = require('./user')
module.exports = async(obj)=>{
  try{
    const auth = await HP.CheckBotOwner(obj)
    let tempCmd, opt
    if(obj && obj.data && obj.data.options){
      if(auth){
        opt = obj.data.options
        tempCmd = await HP.GetOptValue(opt, 'option')
        if(tempCmd && Cmds[tempCmd]){
          await Cmds[tempCmd](obj, opt)
        }else{
          HP.ReplyMsg(obj, {content: (tempCmd ? '**'+tempCmd+'** command not recongnized':'command not provided')})
        }
      }else{
        HP.ReplyMsg(obj, {content: 'This command is only available to the bot owner'})
      }
    }
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
