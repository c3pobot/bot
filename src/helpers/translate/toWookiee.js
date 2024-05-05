'use strict'
const shyriiwook = require('shyriiwook')
module.exports = (content)=>{
  if(!content) return `nothing to translate...`
  return shyriiwook.translate(content)
}
