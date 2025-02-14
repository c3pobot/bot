'use strict'
const getAnywhereResponse = (array, phrase)=>{
  for(let i in array){
    if(phrase.includes(array[i].trigger)) return array[i].response
  }
}
module.exports = (array = [], phrase, anywhere)=>{
  if(!array || array?.length == 0 || !phrase) return
  if(anywhere) return getAnywhereResponse(array.filter(x=>x.anywhere > 0), phrase)
  let tempObj = array.filter(x=>x?.trigger?.toLowerCase() === phrase)
  if(tempObj?.length > 0) return tempObj[0].response
}
