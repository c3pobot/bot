'use strict'
const { msgOpts } = require('src/helpers/msgOpts')
const sendReaction = require('./sendReaction')
const checkForInvite = require('./checkForInvite')

const BOT_OWNER_ID = process.env.BOT_OWNER_ID, HELP_SERVER = process.env.BOT_HELP_SERVER_ID

module.exports = (msg)=>{
  if(!msg || !msg?.content) return
  //if(msg.guild.id === HELP_SERVER) checkForInvite(msg)
  if(msg?.author?.id === BOT_OWNER_ID || msgOpts?.private?.has(msg?.guild?.id) || msgOpts?.vip?.has(msg?.author?.id)) sendReaction(msg)
}
