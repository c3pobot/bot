'use strict'
const Cmds = {}
Cmds.add = require('./add')
Cmds.list = require('./list')
Cmds.remove = require('./remove')
module.exports = async(obj, opt)=>{
  try{
      let tempCmd
      if(opt && opt.find(x=>x.name == 'action')) tempCmd = opt.find(x=>x.name == 'action').value
      if(tempCmd && Cmds[tempCmd]){
        Cmds[tempCmd](obj, opt)
      }else{
        HP.ReplyMsg(obj, {content: (tempCmd ? '**'+tempCmd+'** command not recongnized':'command not provided')})
      }
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
