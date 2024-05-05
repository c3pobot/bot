'use strict'
const Cmds = {}
Cmds.add = require('./add')
Cmds.list = require('./list')
Cmds.remove = require('./remove')
Cmds.edit = require('./edit')
module.exports = async(obj, options = [])=>{
  try{
    let tempCmd, opt = []
    for(let i in options){
      if(Cmds[options[i].name]){
        tempCmd = options[i].name
        if(options[i].options) opt = options[i].options
        break;
      }
    }
    if(tempCmd && Cmds[tempCmd]){
      Cmds[tempCmd](obj, opt)
    }else{
      HP.ReplyMsg(obj, {content: (tempCmd ? '**'+tempCmd+'** command not recongnized':'command not provided')})
    }
  }catch(e){
    console.error(e)
    HP.ReplyError(obj)
  }
}
