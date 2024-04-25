'use strict'
const { msgOpts } = require('helpers/msgOpts')
const { CmdMap } = require('helpers/cmdMap')
module.exports = async(obj = {})=>{
  try{
    let type
    if(CmdMap?.map[obj?.data?.name]) type = CmdMap?.map[obj?.data?.name].worker
    return type
  }catch(e){
    throw(e);
  }
}
