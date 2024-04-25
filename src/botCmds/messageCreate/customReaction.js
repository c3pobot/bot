'use strict'
const log = require('logger')
const { msgOpts } = require('helpers/msgOpts')
const mongo = require('mongoapiclient')
const { CheckPrivateAllowed } = require('./checkAllowed')
const Translate = require('./translate')
const PRIVATE_BOT = process.env.PRIVATE_BOT || false

const CheckTranslate = async(msg, bot)=>{
  try{
    if(!bot || !msg.reference || !msg.content.toLowerCase().startsWith('translate')) return;
    let channel = await bot.channels?.fetch(msg?.reference?.channelId)
    if(!channel) return
    let msgRef = await channel.messages.fetch(msg?.reference?.messageId)
    if(!msgRef) return
    Translate(msgRef, msg.author, null)
  }catch(e){
    log.error(e);
  }
}
const getReactions = async(id)=>{
  try{
    let res = [], obj
    if(id) obj = (await mongo.find('reactions', {_id: id}))[0]
    if(obj?.cr) res = obj.cr
    return res
  }catch(e){
    throw(e);
    return []
  }
}
const getResponse = (array, phrase, anywhere)=>{
  try{
    let res
    if(anywhere){
      for(let i in array){
        if(array[i].anywhere > 0 && phrase.includes(array[i].trigger)){
          res = array[i].response
          break;
        }
      }
    }else{
      const tempObj = array.filter(x=>x?.trigger?.toLowerCase() === phrase)
      if(tempObj?.length > 0) res = tempObj[0].response
    }
    return res
  }catch(e){
    throw(e);
  }
}

const CheckReaction = async(msg)=>{
  try{
    let acrResponse, args = [], vipAcr = [], gAcr = [], localAcr = [], content = []
    if(msg.content) content = msg.content.toString().trim().toLowerCase().split(' ')
    if(!(content?.length > 0)) return
    if(msgOpts?.private?.filter(x=>x === msg?.guild?.id).length > 0 || PRIVATE_BOT){
      gAcr = await getReactions('global')
      localAcr = await getReactions(msg?.guild?.id)
    }
    if(msgOpts?.vip?.filter(x=>x === msg?.author?.id).length > 0){
      let vip = (await mongo.find('vip', {_id: msg?.author?.id}))[0]
      if(vip?.status) vipAcr = await getReactions(msg?.author?.id)
    }
    let phrase = content.shift().toLowerCase()
    for(let i in content) phrase += ' '+content[i].toLowerCase()
    acrResponse = await getResponse(vipAcr, phrase)
    acrResponse = vipAcr?.filter(x=>x.trigger?.toLowerCase() === phrase)[0]?.response
    if(!acrResponse) acrResponse = await getResponse(localAcr, phrase)
    if(!acrResponse) acrResponse = await getResponse(gAcr, phrase)
    //check anywhere
    if(!acrResponse) acrResponse = await getResponse(vipAcr, phrase, true)
    if(!acrResponse) acrResponse = await getResponse(localAcr, phrase, true)
    if(!acrResponse) acrResponse = await getResponse(gAcr, phrase, true)

    if(acrResponse){
      let msg2send
      if(acrResponse.embed){
        msg2send = {embeds: [acrResponse.embed]}
      }else{
        msg2send = {content: acrResponse}
      }
      if(msg2send) msg?.channel?.send(msg2send)
    }
  }catch(e){
    throw(e);
  }
}
module.exports = async(msg, bot)=>{
  try{
    let auth = CheckPrivateAllowed(msg)
    if(!auth) return
    CheckTranslate(msg, bot)
    CheckReaction(msg)
  }catch(e){
    throw(e)
  }
}
