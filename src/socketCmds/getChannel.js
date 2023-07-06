'use strict'
module.exports = async(obj ={}, bot)=>{
  try{
    if(!obj.chId) return;
    let channel = await bot?.channels?.cache?.get(obj.chId)
    if(!channel) channel = await bot?.channels?.fetch(obj.chId)
    return channel
  }catch(e){
    console.error(e)
  }
}
