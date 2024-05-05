'use strict'
const Cmds = {}
Cmds.all = require('./all')
Cmds.guilds = require('./guilds')
Cmds.global = require('./global')
const UpdateWeb = require('./updateWeb')
module.exports = async(obj)=>{
  try{
    if(await HP.CheckBotOwner(obj)){
      let tempCmd
      if(obj.data && obj.data.options){
        for(let i in obj.data.options){
          if(Cmds[obj.data.options[i].value]){
            tempCmd = obj.data.options[i].value
            break
          }
        }
      }
      if(tempCmd && Cmds[tempCmd]){
        await Cmds[tempCmd](obj)
        await UpdateWeb()
      }else{
        HP.ReplyMsg(obj, {content: (tempCmd ? '**'+tempCmd+'** command not recongnized':'command not provided')})
      }
    }else{
      HP.ReplyMsg(obj, {content: 'This command is only available to the bot owner'})
    }
  }catch(e){
    console.error(e)
    HP.ReplyError(obj);
  }
}
