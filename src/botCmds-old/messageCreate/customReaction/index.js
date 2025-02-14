'use strict'
const checkTranslate = require('./checkTranslate')
const checkReaction = require('./checkReaction')
const { checkPrivateAllowed } = require('src/helpers/checkAllowed')

module.exports = async(msg, bot)=>{
  let auth = checkPrivateAllowed(msg)
  if(!auth) return
  checkTranslate(msg, bot)
  checkReaction(msg)
}
