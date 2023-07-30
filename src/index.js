'use strict'
const log = require('logger')
const path = require('path')
const k8api = require('./k8api')
const { Client, GatewayIntentBits } = require('discord.js');
const { mongoStatus } = require('mongoapiclient')

const RemoteCmds = require('./remoteCmds')
const BotCmds = require('./botCmds')
const fetch = require('./fetch')
const app = require('./expressServer')

const BOT_TOKEN = process.env.BOT_TOKEN
const PORT = process.env.PORT || 3000
const POD_NAME = process.env.POD_NAME

let botReady = false, SHARD_NUM, NUM_SHARDS, bot
app.get('/getNumShards', (req, res)=>{
  res.json({totalShards: NUM_SHARDS})
})
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
  log.info('Creating bot client on shard '+SHARD_NUM+' of '+NUM_SHARDS+' total shards')
  let botOpts = {
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
  }
  if(NUM_SHARDS > 1){
    botOpts.shards = SHARD_NUM
    botOpts.shardCount = NUM_SHARDS
  }
  bot = new Client(botOpts);
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
const monitorReplica = async()=>{
  try{
    if(NUM_SHARDS && NUM_SHARDS > 0){
      let numShards = await k8api.getNumShards()
      if(numShards && +numShards !== NUM_SHARDS){
        await recreateBot(+numShards)
      }
    }
    setTimeout(monitorReplica, 5000)
  }catch(e){
    log.error(e)
    setTimeout(monitorReplica, 5000)
  }
}
const recreateBot = async(numShards)=>{
  try{
    if(numShards > 0 && bot){
      log.info('Number of bot shards changed from '+NUM_SHARDS+' to '+numShards+' recreating bot...')
      await bot.destroy()
      bot = null
      NUM_SHARDS = numShards
      createBot()
    }
  }catch(e){
    throw(e)
  }
}
const StartBot = async()=>{
  try{
    if(!POD_NAME) throw('POD_NAME not supplied...')
    let res = await k8api.getShardNum()
    if(!res) throw("Error getting shard number...")
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
monitorReplica()
