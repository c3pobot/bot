'use strict'
const translate = require('@vitalets/google-translate-api')
const ToWookiee = require('shyriiwook')
const Emoji = require('./emoji.json')
const FromWookiee = require('./wookiee.json')
const TranslateBasic = (data)=>{
  let translatedData = ''
  for (let i = 0; i < data.length; i += 1) {
    const char = data[i];
    if (data.substr(i, 4) === "null") {
      translatedData += "null";
      i += 3;
      continue;
    }

    // avoid translating escape sequences
    if (char === "\\" && i < data.length - 1) {
      translatedData += char + data[i + 1];
      i += 1;
      continue;
    }
    if (FromWookiee[char]) {
      translatedData += FromWookiee[char];
    } else {
      if(FromWookiee[char + data[i + 1]]){
        translatedData += FromWookiee[char + data[i + 1]];
        i += 1
      }else{
        translatedData += char;
      }
    }
  }
  return translatedData;
}
module.exports = async(obj)=>{
  try{
    let chId, msgId, msg2send = {content: 'Error Translating text'}, toLang = 'en', translated
    if(obj.reference) msg2send.message_reference = {message_id: obj.reference.messageID}
    if(obj.emojiName) toLang = obj.emojiName
    if(Emoji[toLang]) toLang = Emoji[toLang]
    if(obj.content){
      if(toLang == 'wookie' || toLang == 'wookiee' || toLang == 'basic'){
        translated = {
          from: {
            language: {}
          }
        }
        if(toLang == 'wookie' || toLang == 'wookiee'){
          translated.text = await ToWookiee(obj.content)
          translated.from.language.iso = 'basic'
        }else{
          translated.text = await TranslateBasic(obj.content)
          translated.from.language.iso = 'wookiee'
        }
      }else{
        translated = await translate(obj.content, {to: toLang})
      }
    }
    if(translated && translated.text){
      const embedMsg = {
        color: '15844367',
        title: process.env.BOT_NAME+' translated from **'+(translated.from && translated.from.language && translated.from.language.iso ? translated.from.language.iso:'unknown')+'** to **'+toLang+'**',
        description: 'Original :\n```\n'+obj.content+'\n```\nTranslation :\n```\n'+translated.text+'\n```\n'
      }
      msg2send.content = null,
      msg2send.embeds = [embedMsg]
      await HP.SendMsg({sId: obj.sId, chId: obj.chId}, msg2send)
    }
  }catch(e){
    console.log(e)
  }
}
