'use strict'
const Cmds = {}
Cmds.show = require('./show')
module.exports = async(obj)=>{
  try{
    let tempCmd = 'show'
    await Cmds[tempCmd](obj, obj.data.options)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
