'use strict'
const { msgOpts } = require('helpers/msgOpts')
const { CmdMap } = require('helpers/cmdMap')
module.exports = async(obj = {})=>{
  try{
    let type
    if(CmdMap?.map[obj?.data?.name]) type = CmdMap?.map[obj?.data?.name].worker
    if(!type) return
    if(msgOpts?.private?.filter(x=>x === obj.guild_id).length > 0) type += 'Private'
    return type
  }catch(e){
    throw(e);
  }
}
