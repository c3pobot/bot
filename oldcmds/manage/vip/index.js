'use strict'
const Cmds = {}
Cmds.add = require('./add')
Cmds.edit = require('./edit')
Cmds.remove = require('./remove')
module.exports = async(obj, opt = [])=>{
  try{
    let tempCmd, options = []
    for(let i in opt){
      if(Cmds[opt[i].name]){
        tempCmd = opt[i].name
        if(opt[i].options) options = opt[i].options
        break;
      }
    }
    if(tempCmd && Cmds[tempCmd]){
      Cmds[tempCmd](obj, options)
    }else{
      HP.ReplyMsg(obj, {content: (tempCmd ? '**'+tempCmd+'** command not recongnized':'command not provided')})
    }
  }catch(e){
    console.error(e)
    HP.ReplyError(obj)
  }
}
