'use strict'
const log = require('logger')
const { msgOpts } = require('./msgOpts')

const BOT_OWNER_ID = process.env.BOT_OWNER_ID
const BOT_STALKER_ID = process.env.BOT_STALKER_ID
const PRIVATE_BOT = process.env.PRIVATE_BOT || false
module.exports.checkBasicAllowed = (msg, usr = null)=>{
  if(!msg) return
  if(PRIVATE_BOT) return true;
  if(msgOpts?.vip?.has(msg?.author?.id)) return true;
  if(msgOpts?.basic?.has(msg?.guild?.id) || msgOpts?.private?.has(msg?.guild?.id)) return true;
  return;
}
module.exports.checkPrivateAllowed = (msg)=>{
  if(!msg) return
  if(PRIVATE_BOT) return true;
  if(msg?.author?.id === BOT_OWNER_ID) return true;
  if(BOT_STALKER_ID && msg?.author?.id === BOT_STALKER_ID) return true;
  if(msgOpts?.private?.has(msg?.guild?.id) || msgOpts?.vip?.has(msg?.author?.id)) return true;
}
