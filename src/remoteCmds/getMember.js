'use strict'
module.exports = async(obj = {}, bot)=>{
  try{
    if(!obj.dId) return
    let usr = await bot.users?.cache?.get(obj.dId)
    if(!usr) usr = await bot.users?.fetch(obj.dId)
    return usr
  }catch(e){
    throw(e)
  }
}
