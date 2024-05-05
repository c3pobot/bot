'use strict'
module.exports = (obj)=>{
  if(!obj?.message?.interaction?.user) return
  if(obj?.user?.id === obj?.message.interaction.user.id) return true
}
