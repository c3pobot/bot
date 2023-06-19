'use strict'
const { Client, GatewayIntentBits } = require('discord.js');
const BotCmds = require('./cmds')
const SHARD_NUM = +process.env.SHARD_NUM
const NUM_SHARDS = +process.env.NUM_SHARDS
global.botReady = 0
global.bot = new Client({
  shards: SHARD_NUM,
  shardCount: NUM_SHARDS,
  sweepers: {
    messages: {
      lifetime: 300,
      interval: 120
    }
  },
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent
  ]
});

const CheckBotReady = async()=>{
  if(botReady > 0){
    console.log('Bot on shard '+SHARD_NUM+' is ready')
  }else{
    console.log('Bot on shard '+SHARD_NUM+' is not ready will retry in 5 seconds')
    setTimeout(CheckBotReady, 5000)
  }
}


bot.on('guildMemberAdd', member => {
   BotCmds(member, 'addMember')
  const info = msgOpts.member.find(x=>x.sId === member?.guild?.id)
  if(info)
})
bot.on('guildMemberRemove', member => {
  BotCmds(member, 'removeMember')
  const info = msgOpts.member.find(x=>x.sId === member?.guild?.id)
  if(info?.memberLeave) BotCmds.leave(member, info)
})
bot.on('ready', async()=>{
  console.log('Bot '+process.env.SHARD_NUM+' has started in '+bot.guilds.cache.size+' guilds')
  botReady = 1;
});
bot.on('messageCreate', (msg) =>{
  BotCmds(msg, 'reaction')
  if(!msg.guild || msg.author.bot || botReady === 0 || mongoReady === 0) return;
  CheckMessage(msg);
})
bot.on('messageDelete', (msg)=>{
  BotCmds(msg, 'deleteMsg')
  if(!msg.guild || msg.author.bot || botReady === 0 || mongoReady === 0) return;
  const info = msgOpts.message.find(x=>x.sId === msg?.guildId)
  if(info?.msgDelete) BotCmds.delete(msg, info)
})
bot.on('messageReactionAdd', (reaction, usr)=>{
  if(usr.bot || botReady === 0 || mongoReady === 0) return;
  BotCmds({reaction: reaction, usr: usr}, 'translate')
})
bot.on('messageUpdate', (oldMsg, newMsg)=>{
  if(!newMsg.guild || newMsg.author.bot || botReady === 0 || mongoReady === 0) return;
  BotCmds({oldMsg: oldMsg, newMsg: newMsg}, 'editMsg')
})
const StartBot = async()=>{
  bot.login(process.env.BOT_TOKEN)
  CheckBotReady()
}
StartBot()
