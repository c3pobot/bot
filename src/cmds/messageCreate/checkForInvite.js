'use strict'
const inviteEmbed = {
  description: '┏━━━━━━━━━━━━━━━━━━┓\n┏┫ **• C3PO • IMPORTANT • LINKS •**\n┃┣━━━━━━━━━━━━━━━━━┛\n┃┣ **[Bot Invite Link]('+process.env.BOT_INVITE_LINK+')** \n┃┃───────────────── \n┃┣ **[Discord]('+process.env.BOT_DISCORD_LINK+')** \n┃┃───────────────── \n┃┣ **[Patreon]('+process.env.BOT_PATREON_LINK+')** \n┃┃───────────────── \n┃┣ **[Paypal.me](https://paypal.me/scubafrik)**\n┃┃───────────────── \n┃┣ **[C3PO online features]('+process.env.WEB_CONFIG_URL+')**\n┃┃───────────────── \n┗┻━━━━━━━━━━━━━━━━━┛',
  color: 15844367,
  image: {
    url: process.env.BOT_INVITE_GIF
  }
}
module.exports = (msg)=>{
  const args = msg?.content?.trim().split(/ +/g);
  if(args.filter(x=>x.toLowerCase() == 'invite').length > 0) msg.channel.send({embeds: [inviteEmbed]})
}
