'use strict'

module.exports = async(msg, translated = {}, toLang, fromLang, msg2send)=>{
  if(!translated.text) return
  if(!fromLang) fromLang = translated?.raw?.src
  let embedMsg = {
    color: '15844367',
    title: `${msg?.client?.user?.username || 'bot'} translated from **${(fromLang ? fromLang:'unknown')}** to **${toLang}**`,
    description: 'Original :\n```\n'+msg.content+'\n```\nTranslation :\n```\n'+translated.text+'\n```\n'
  }
  msg2send.content = null,
  msg2send.embeds = [embedMsg]
  msg?.reply(msg2send)
}
