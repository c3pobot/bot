'use strict'
const log = require('logger')
let logLevel = process.env.LOG_LEVEL || log.Level.INFO;
log.setLevel(logLevel);
const path = require('path')
const { Client, GatewayIntentBits } = require('discord.js');
const { mongoStatus } = require('mongoapiclient')

const RemoteCmds = require('./remoteCmds')
const BotCmds = require('./botCmds')
const fetch = require('./fetch')
const app = require('./expressServer')

const BOT_TOKEN = process.env.BOT_TOKEN
const PORT = process.env.PORT || 3000
const POD_NAME = process.env.POD_NAME
const BOT_BRIDGE_URI = process.env.BOT_BRIDGE_URI

let botReady = false, SHARD_NUM, NUM_SHARDS, bot
app.post('/cmd', (req, res)=>{
  handleRequest(req, res)
})
const server = app.listen(PORT, ()=>{
  log.info(POD_NAME+' is listening on port '+server.address().port)
})

const handleRequest = async(req, res)=>{
  try{
    if(!req?.body || req?.body?.podName !== POD_NAME || !req?.body?.cmd || !RemoteCmds[req?.body?.cmd]){
      res.sendStatus(400)
      return
    }
    let response = await RemoteCmds[req.body.cmd](req.body, bot)
    if(response){
      res.status(200).json(response)
    }else{
      res.sendStatus(400)
    }
  }catch(e){
    log.error(e)
    res.sendStatus(400)
  }
}
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
    if(!POD_NAME) throw('POD_NAME not supplied...')
    let res = await fetch(path.join(BOT_BRIDGE_URI, 'cmd'), { cmd: 'getBotShardNum', botToken: BOT_TOKEN, podName: POD_NAME })
    SHARD_NUM = +res?.shardNum, NUM_SHARDS = +res?.totalShards
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
