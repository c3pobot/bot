'use strict'
const HELP_SERVER = process.env.BOT_HELP_SERVER_ID
const checkForInvite = require('./checkForInvite')
const customReaction = require('./customReaction')

module.exports = async(msg, bot)=>{
  if(!msg || !bot || !msg?.guild || msg?.author?.bot) return;
  if(msg.guild.id === HELP_SERVER) checkForInvite(msg)
  customReaction(msg, bot)
}
