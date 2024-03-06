'use strict'
const { msgOpts } = require('./msgOpts')
const { CmdMap } = require('./cmdMap')
module.exports = async(interaction = {})=>{
  try{
    let type
    if(CmdMap?.map[interaction.commandName]) type = CmdMap?.map[interaction.commandName].worker
    if(!type) return
    if(msgOpts?.private?.filter(x=>x === interaction.commandGuildId).length > 0) type += 'Private'
    return type
  }catch(e){
    throw(e);
  }
}
