'use strict'
const Cmds = {}
Cmds.basic = require('./basic')
Cmds.all = require('./all')
Cmds.private = require('./private')
module.exports = async(obj)=>{
  try{
    if(await HP.CheckBotOwner(obj)){
      let tempCmd, opt
      if(obj.data.options) opt = obj.data.options
      if(opt && opt.find(x=>x.name == 'option')) tempCmd = opt.find(x=>x.name == 'option').value
      if(tempCmd && Cmds[tempCmd]){
        await Cmds[tempCmd](obj, opt)
      }else{
        HP.ReplyMsg(obj, {content: (tempCmd ? '**'+tempCmd+'** command not recongnized':'command not provided')})
      }
    }else{
      HP.ReplyMsg(obj, {content: 'This command is only available to the bot owner'})
    }
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
