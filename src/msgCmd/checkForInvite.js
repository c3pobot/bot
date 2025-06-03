'use strict'
const { botSettings } = require('src/helpers/botSettings')

module.exports = (msg)=>{
  if(!botSettings?.botInvite) return
  let args = msg?.content?.trim().split(/ +/g);
  if(args.filter(x=>x.toLowerCase() === 'invite').length === 0) return
  let embedMsg = {
    description: '',
    color: 15844367
  }
  if(botSettings.botInvite.inviteGif) embedMsg.image = { url: botSettings.botInvite.inviteGif }
  embedMsg.description += '┏━━━━━━━━━━━━━━━━━━┓\n'
  embedMsg.description += '┏┫ **• C3PO • IMPORTANT • LINKS •**\n'
  embedMsg.description += '┃┣━━━━━━━━━━━━━━━━━┛\n'
  embedMsg.description += '┃┣ **[Bot Invite Link]('+botSettings.botInvite.inviteLink+')** \n'
  embedMsg.description += '┃┃───────────────── \n'
  embedMsg.description += '┃┣ **[Discord]('+botSettings.botInvite.discordHelpServerLink+')** \n'
  embedMsg.description += '┃┃───────────────── \n'
  embedMsg.description += '┃┣ **[Patreon]('+botSettings.botInvite.patreonLink+')** \n'
  embedMsg.description += '┃┃───────────────── \n'
  embedMsg.description += '┃┣ **[Paypal.me](https://paypal.me/scubafrik)**\n'
  embedMsg.description += '┃┃───────────────── \n'
  embedMsg.description += '┃┣ **[C3PO online features]('+botSettings.botInvite.webConfigUrl+')**\n'
  embedMsg.description += '┃┃───────────────── \n'
  embedMsg.description += '┗┻━━━━━━━━━━━━━━━━━┛'
  msg.channel.send({ embeds: [embedMsg] })
}
