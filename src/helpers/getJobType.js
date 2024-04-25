'use strict'
const { msgOpts } = require('./msgOpts')
const { CmdMap } = require('./cmdMap')
module.exports = async(interaction = {})=>{
  try{
    let type
    if(CmdMap?.map[interaction.commandName]) type = CmdMap?.map[interaction.commandName].worker
    if(!type) return
    return type
  }catch(e){
    throw(e);
  }
}
