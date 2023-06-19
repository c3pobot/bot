'use strict'
const { CheckBasicAllowed } = require('./checkAllowed')
const CheckForInvite = require('./checkForInvite')
const CreateQueObj = require('./createQueObj')
const GetQueName = require('./getQueName')
const PRIVATE_BOT = +process.env.PRIVATE_BOT || 0

module.exports = async(msg, msgOpts)=>{
  try{
    if(!msg.content || !msgOpts) return;
    let auth = await CheckBasicAllowed(msg, msgOpts)
    if(!auth) return;
    let queName = await GetQueName(msg, msgOpts)
    if(!queName) return;
    if(msg.reference && msg.content.toLowerCase().startsWith('translate')) Translate(msg, msgOpts)
    let msgObj = await CreateQueObj(msg, 'reaction')
    if(PRIVATE_BOT) msgObj.global = 1
    msgObj = {...msgObj,...{ data: {name: 'runner'}, vip: +(msgOpts?.vip?.filter(x=>x === msg?.author?.id).length || 0)}}
    Que.add(queName, tempObj)
  }catch(e){
    console.log(e)
  }
}
