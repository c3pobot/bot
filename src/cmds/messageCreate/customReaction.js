'use strict'
const CreateQueObj = require('./createQueObj')
const GetQueName = require('./getQueName')
const Translate = require('./translate')
const PRIVATE_BOT = +process.env.PRIVATE_BOT || 0
module.exports = async(msg, msgOpts)=>{
  try{
    let queName = await GetQueName(msg, msgOpts)
    if(!queName) return;
    if(msg.reference && msg.content.toLowerCase().startsWith('translate')) Translate(msg, queName, null, null)
    let msgObj = await CreateQueObj(msg, 'reaction')
    if(PRIVATE_BOT) msgObj.global = 1
    msgObj = {...msgObj,...{ data: {name: 'runner'}, vip: +(msgOpts?.vip?.filter(x=>x === msg?.author?.id).length || 0)}}
    Que.add(queName, msgObj)
  }catch(e){
    console.log(e)
  }
}
