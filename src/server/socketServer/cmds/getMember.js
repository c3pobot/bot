'use strict'
module.exports = async(obj = {}, content)=>{
  try{
    if(!obj.dId) return
    let usr = await bot.users?.cache?.get(obj.dId)
    if(!usr) usr = await bot.users?.fetch(obj.dId)
    return usr
  }catch(e){
    console.error(e)
  }
}
