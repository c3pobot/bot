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
global.debugMsg = +process.env.DEBUG || 0
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
})
bot.on('guildMemberRemove', member => {
  BotCmds(member, 'removeMember')
})
bot.on('ready', async()=>{
  botReady = 1;
  console.log('bot-'+SHARD_NUM+' has started in '+bot.guilds.cache.size+' guilds')
});
bot.on('messageCreate', (msg) =>{
  BotCmds(msg, 'messageCreate')
})
bot.on('messageDelete', (msg)=>{
  BotCmds(msg, 'messageDelete')
})
bot.on('messageReactionAdd', (reaction, usr)=>{
  BotCmds({reaction: reaction, usr: usr}, 'messageReactionAdd')
})
bot.on('messageUpdate', (oldMsg, newMsg)=>{
  BotCmds({oldMsg: oldMsg, newMsg: newMsg}, 'messageUpdate')
})
const StartBot = async()=>{
  bot.login(process.env.BOT_TOKEN)
  CheckBotReady()
}
StartBot()
