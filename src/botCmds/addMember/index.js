'use strict'
const { msgOpts } = require('src/helpers/msgOpts')
const sendJoin = require('./sendJoin')
const sendWelcome = require('./sendWelcome')
module.exports = async(member, bot)=>{
  let info = msgOpts?.member?.get(member?.guild?.id)
  if(!info?.sId) return;
  if(info.newMember) sendJoin(member, info.newMember, bot)
  if(info.welcome?.msg && info.welcome?.chId && info.welcome?.status > 0 && member) sendWelcome(member, info.welcome.chId, info.welcome.msg, bot)
  if(info.welcomeAlt?.msg && info.welcomeAlt?.chId && info.welcomeAlt?.status > 0 && member) sendWelcome(member, info.welcomeAlt.chId, info.welcomeAlt.msg, bot)
}
