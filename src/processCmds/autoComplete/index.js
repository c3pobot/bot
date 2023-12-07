'use strict'
const log = require('logger')
const { autoCompleteData } = require('./autoCompleteData')
const getChoices = (obj={})=>{
  try{
    let returnArray = []
    let key = autoCompleteData?.nameKeys[obj.name]
    if(!key) key = autoCompleteData?.nameKeys[obj.name?.split('-')[0]]
    if(key) returnArray = (autoCompleteData?.autoObj[key]?.filter(x=>x.name.toLowerCase().includes(obj.value.toLowerCase())) || [])
    if(returnArray.length > 0 && returnArray.length < 26) return returnArray
  }catch(e){
    log.error(e)
  }
}
module.exports = (interaction)=>{
  try{
    if(!interaction?.isAutocomplete()) return
    let choices = getChoices(interaction.options.getFocused(true))
    if(choices) interaction.respond(choices)
  }catch(e){
    log.error(e)
  }
}
