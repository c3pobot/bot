'use strict'
module.exports = async(obj = {})=>{
  try{
    if(!obj.sId) return
    let res = await bot?.guilds?.cache?.get(obj.sId)
    if(!res) res = await bot?.guilds?.fetch(obj.sId)
    return res
  }catch(e){
    console.error(e)
  }
}
