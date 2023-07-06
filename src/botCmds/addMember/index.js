'use strict'
const SendJoin = require('./sendJoin')
const SendWelcome = require('./sendWelcome')
module.exports = async(member, msgOpts, bot)=>{
  try{
    const info = msgOpts?.member.find(x=>x.sId === member?.guild?.id)
    if(!info) return;
    if(info.newMember) SendJoin(member, info.newMember, bot)
    if(info.welcome?.msg && info.welcome?.chId && info.welcome?.status > 0 && member) SendWelcome(member, info.welcome.chId, info.welcome.msg, bot)
    if(info.welcomeAlt?.msg && info.welcomeAlt?.chId && info.welcomeAlt?.status > 0 && member) SendWelcome(member, info.welcomeAlt.chId, info.welcomeAlt.msg, bot)
  }catch(e){
    throw(e);
  }
}
