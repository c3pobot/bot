'use strict'
const { msgOpts } = require('helpers/msgOpts')
const mongo = require('mongoapiclient')
const { CheckPrivateAllowed } = require('./checkAllowed')
const GetQueName = require('./getQueName')
const Translate = require('./translate')
const CheckTranslate = async(msg)=>{
  try{
    if(!msg.reference || !msg.content.toLowerCase().startsWith('translate')) return;
    const queName = await GetQueName(msg)
    if(!queName) return;
    Translate(msg, queName, null, null)
  }catch(e){
    throw(e);
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
    if(msgOpts?.private?.filter(x=>x === msg?.guild?.id).length > 0){
      gAcr = await getReactions('global')
      localAcr = await getReactions(msg?.guild?.id)
    }
    if(msgOpts?.vip?.filter(x=>x === msg?.author?.id).length > 0){
      const vip = (await mongo.find('vip', {_id: msg?.author?.id}))[0]
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
module.exports = async(msg)=>{
  try{
    let auth = CheckPrivateAllowed(msg)
    if(!auth) return
    CheckTranslate(msg, msgOpts)
    CheckReaction(msg, msgOpts)
  }catch(e){
    throw(e)
  }
}
