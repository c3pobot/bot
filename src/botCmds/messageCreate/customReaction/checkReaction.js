'use strict'
const mongo = require('mongoclient')
const checkTranslate = require('./checkTranslate')
const getReactions = require('./getReactions')
const getResponse = require('./getResponse')

const { msgOpts } = require('src/helpers/msgOpts')

module.exports = async(msg)=>{
  if(!msg.content) return
  let vcr = [], gcr = [], lcr = []
  let content = msg.content.toString().trim().toLowerCase().split(' ')
  if(!(content?.length > 0)) return

  if(msgOpts?.private?.has(msg?.guild?.id)){
    gcr = await getReactions('global')
    lcr = await getReactions(msg?.guild?.id)
  }
  if(msgOpts?.vip?.has(msg?.author?.id)){
    let vip = (await mongo.find('vip', {_id: msg?.author?.id}, { status: 1 }))[0]
    if(vip?.status) vcr = await getReactions(msg?.author?.id)
  }
  let phrase = content.shift().toLowerCase()
  for(let i in content) phrase += ' '+content[i].toLowerCase()
  let res = getResponse(vcr, phrase)
  if(!res) res = getResponse(lcr, phrase)
  if(!res) res = getResponse(gcr, phrase)

  if(!res) res = getResponse(vcr, phrase, true)
  if(!res) res = getResponse(lcr, phrase, true)
  if(!res) res = getResponse(gcr, phrase, true)
  if(!res) return

  let msg2send
  if(res.embed){
    msg2send = { embeds: [res.embed] }
  }else{
    msg2send = { content: res }
  }
  if(msg2send) msg?.channel?.send(msg2send)
}
