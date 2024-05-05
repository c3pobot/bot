'use strict'
module.exports = async(obj = {}, bot)=>{
  if(!obj.chId) return
  return await bot?.channels?.fetch(chId)
}
