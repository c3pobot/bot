'use strict'
const { CheckBasicAllowed } = require('./checkAllowed')
const CheckForInvite = require('./checkForInvite')
const HELP_SERVER = process.env.BOT_HELP_SERVER_ID
const CustomReaction = require('./customReaction')

module.exports = async(msg, msgOpts)=>{
  try{
    if(!msg?.guild || msg?.author?.bot) return;
    CustomReaction(msg, msgOpts)
    let auth = await CheckBasicAllowed(msg, msgOpts)
    if(!auth) return;
    if(msg.guild.id === HELP_SERVER) CheckForInvite(msg)
  }catch(e){
    console.error(e);
  }
}
