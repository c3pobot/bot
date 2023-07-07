'use strict'
const { botSettings } = require('helpers/botSettings')
module.exports = (msg)=>{
  try{
    if(!botSettings.map.botInvite) return
    const args = msg?.content?.trim().split(/ +/g);
    if(args.filter(x=>x.toLowerCase() === 'invite').length === 0) return
    let embedMsg = {
      description: '',
      color: 15844367
    }
    if(botSettings.map.botInvite.inviteGif) embedMsg.image = { url: botSettings.map.botInvite.inviteGif }
    embedMsg.description += '┏━━━━━━━━━━━━━━━━━━┓\n'
    embedMsg.description += '┏┫ **• C3PO • IMPORTANT • LINKS •**\n'
    embedMsg.description += '┃┣━━━━━━━━━━━━━━━━━┛\n'
    embedMsg.description += '┃┣ **[Bot Invite Link]('+botSettings.map.botInvite.inviteLink+')** \n'
    embedMsg.description += '┃┃───────────────── \n'
    embedMsg.description += '┃┣ **[Discord]('+botSettings.map.botInvite.discordHelpServerLink+')** \n'
    embedMsg.description += '┃┃───────────────── \n'
    embedMsg.description += '┃┣ **[Patreon]('+botSettings.map.botInvite.patreonLink+')** \n'
    embedMsg.description += '┃┃───────────────── \n'
    embedMsg.description += '┃┣ **[Paypal.me](https://paypal.me/scubafrik)**\n'
    embedMsg.description += '┃┃───────────────── \n'
    embedMsg.description += '┃┣ **[C3PO online features]('+botSettings.map.botInvite.webConfigUrl+')**\n'
    embedMsg.description += '┃┃───────────────── \n'
    embedMsg.description += '┗┻━━━━━━━━━━━━━━━━━┛'
    msg.channel.send({embeds: [embedMsg]})
  }catch(e){
    throw(e)
  }
}
