'use strict'
const log = require('logger')
let logLevel = process.env.LOG_LEVEL || log.Level.INFO;
log.setLevel(logLevel);
const POD_NAME = process.env.POD_NAME
const BOT_BRIDGE_URI = process.env.BOT_BRIDGE_URI
const SocketClient = require('./socket')
const SocketCmds = require('./socketCmds')
const { mongoStatus } = require('mongoapiclient')
const { Client, GatewayIntentBits } = require('discord.js');
const BotCmds = require('./botCmds')
const BOT_TOKEN = process.env.BOT_TOKEN
require('./expressServer')
let botReady = false, SHARD_NUM, NUM_SHARDS, bot


SocketClient.socket.on('request', async(cmd, obj = {}, callback)=>{
  try{
    log.debug(cmd)
    log.debug(JSON.stringify(obj))
    let res
    if(SocketCmds[cmd] && obj.podName === POD_NAME) res = await SocketCmds[cmd](obj, bot)
    if(callback) callback(res)
  }catch(e){
    log.error(e)
    if(callback) callback({status: 'error', message: e.message || 'error occured'})
  }
})
const createBot = ()=>{
  bot = new Client({
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
  bot.on('guildMemberAdd', member => {
     BotCmds(member, 'addMember', bot)
  })
  bot.on('guildMemberRemove', member => {
    BotCmds(member, 'removeMember', bot)
  })
  bot.on('ready', async()=>{
    botReady = true;
    log.info('bot-'+SHARD_NUM+' has started in '+bot.guilds.cache.size+' guilds')
  });
  bot.on('messageCreate', (msg) =>{
    if(msg.author.bot) return
    BotCmds(msg, 'messageCreate', bot)
  })
  bot.on('messageDelete', (msg)=>{
    BotCmds(msg, 'messageDelete', bot)
  })
  bot.on('messageReactionAdd', (reaction, usr)=>{
    if(usr.bot) return
    BotCmds({reaction: reaction, usr: usr}, 'messageReactionAdd', bot)
  })
  bot.on('messageUpdate', (oldMsg, newMsg)=>{
    if(newMsg.author.bot || oldMsg.author.bot) return
    BotCmds({oldMsg: oldMsg, newMsg: newMsg}, 'messageUpdate', bot)
  })
  bot.login(BOT_TOKEN)
}

const StartBot = async()=>{
  try{
    let res = await SocketClient.call('getBotShardNum', {botToken: BOT_TOKEN, podName: POD_NAME})
    SHARD_NUM = res?.shardNum, NUM_SHARDS = res?.totalShards
    if(SHARD_NUM >= 0 && NUM_SHARDS && BOT_TOKEN){
      createBot()
      return
    }
    setTimeout(StartBot, 5000)
  }catch(e){
    log.error(e);
    setTimeout(StartBot, 5000)
  }
}
const CheckMongo = async()=>{
  try{
    let status = mongoStatus()
    if(status){
      StartBot()
      return
    }
    setTimeout(CheckMongo, 5000)
  }catch(e){
    log.error(e);
    setTimeout(CheckMongo, 5000)
  }
}
CheckMongo()
