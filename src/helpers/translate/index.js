'use strict'
const log = require('logger')
const { translate } = require('@vitalets/google-translate-api')
const toWookiee = require('./toWookiee')
const fromWookiee = require('./fromWookiee')
const emoji = require('./emoji.json')
const sendTranslation = require('./sendTranslation')

module.exports = async(msg, emojiName)=>{
  try{
    if(!msg) return
    let msg2send = { content: `nothing to translate...` }, toLang = 'en', translated = { }
    if(!msg.content) return

    if(emojiName) toLang = emojiName
    if(emoji[toLang]) toLang = emoji[toLang]

    if(toLang == 'wookie' || toLang == 'wookiee'){
      translated.text = toWookiee(msg.content)
      sendTranslation(msg, translated, toLang, 'basic', msg2send)
      return
    }

    if(toLang == 'basic'){
      translated.text = fromWookiee(msg.content)
      sendTranslation(msg, translated, 'wookiee', msg2send)
      return
    }

    translated = await translate(msg.content, { to: toLang })
    sendTranslation(msg, translated, toLang, null, msg2send)
  }catch(e){
    log.error(e)
  }
}
