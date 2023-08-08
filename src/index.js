'use strict'
const log = require('logger')
const path = require('path')
const { Client, GatewayIntentBits } = require('discord.js');
const { mongoStatus } = require('mongoapiclient')
const { CreateQues } = require('./helpers/cmdQue')

const RemoteCmds = require('./remoteCmds')
const BotCmds = require('./botCmds')
const informer = require('./informer')
const fetch = require('./fetch')
const app = require('./expressServer')

const BOT_TOKEN = process.env.BOT_TOKEN
const PORT = process.env.PORT || 3000
const POD_NAME = process.env.POD_NAME
const SET_NAME = process.env.SET_NAME || 'bot'
const NAME_SPACE = process.env.POD_NAMESPACE

let botReady = false, SHARD_NUM, NUM_SHARDS, bot
if(POD_NAME && SET_NAME) SHARD_NUM = +POD_NAME.replace(`${SET_NAME}-`, '')
app.get('/getNumShards', (req, res)=>{
  res.status(200).json({totalShards: NUM_SHARDS})
})
app.post('/cmd', (req, res)=>{
  handleRequest(req, res)
})
const server = app.listen(PORT, ()=>{
  log.info(`${POD_NAME} is listening on port ${server.address().port}`)
})
informer.on('add', (obj) => {
  if(obj?.metadata?.name === SET_NAME){
    log.info(`${SET_NAME} replica's detected ${obj?.spec?.replicas}`)
    NUM_SHARDS = +obj?.spec?.replicas

  }
});
informer.on('update', (obj) => {
  if(obj?.metadata?.name === SET_NAME && NUM_SHARDS !== obj?.spec?.replicas){
    if(SHARD_NUM >= 0 && BOT_TOKEN) recreateBot(obj?.spec?.replicas)
  }
});
const handleRequest = async(req, res)=>{
  try{
    if(!req?.body || req?.body?.podName !== POD_NAME || !req?.body?.cmd || !RemoteCmds[req?.body?.cmd]){
      res.sendStatus(400)
      return
    }
    if(req.body.numShards >= 0 && NUM_SHARDS >= 0 && req.body.numShards !== NUM_SHARDS){
      res.status(200).json({ totalShards: NUM_SHARDS })
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
const recreateBot = async(numShards)=>{
  try{
    if(numShards > 0 && bot){
      log.info(`Number of bot shards changed from ${NUM_SHARDS} to ${numShards} recreating bot...`)
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
      CreateQues()
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
