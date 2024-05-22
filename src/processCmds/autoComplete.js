'use strict'
const log = require('logger')
const { dataList } = require('src/helpers/dataList')

const getChoices = (obj={})=>{
  let returnArray = []
  let key = dataList?.nameKeys[obj.name]
  if(!key) key = dataList?.nameKeys[obj.name?.split('-')[0]]
  if(key) returnArray = (dataList?.autoObj[key]?.filter(x=>x?.name?.toLowerCase().includes(obj?.value?.toLowerCase())) || [])
  if(returnArray.length > 0 && returnArray.length < 26) return returnArray
}
module.exports = (interaction)=>{
  if(!interaction?.isAutocomplete()) return
  let choices = getChoices(interaction?.options?.getFocused(true))
  if(choices) interaction.respond(choices)
}
