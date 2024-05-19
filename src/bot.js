'use strict'
const log = require('logger')
const { Client, GatewayIntentBits } = require('discord.js');

const app = require('./expressServer');
const remoteCmds = require('./remoteCmds');
const botCmds = require('./botCmds');
const processCmds = require('./processCmds');

const BOT_TOKEN = process.env.BOT_TOKEN, POD_NAME = process.env.POD_NAME || 'bot', NAME_SPACE = process.env.NAME_SPACE || 'default', SET_NAME = process.env.SET_NAME || 'bot', PORT = process.env.PORT || 3000
let SHARD_NUM = +POD_NAME?.replace(`${SET_NAME}-`, ''), NUM_SHARDS = 0, BOT_READY, bot

const server = app.listen(PORT, ()=>{
  log.info(`${POD_NAME} is listening on port ${server.address().port}`)
})
app.get('/getNumShards', (req, res)=>{
  res.status(200).json({ totalShards: NUM_SHARDS })
})
app.post('/cmd', (req, res)=>{
  handleCmdRequest(req, res)
})
const handleCmdRequest = async(req, res)=>{
  try{
    if(!remoteCmds){
      res.sendStatus(400)
      return
    }
    if(!req?.body || req?.body?.podName !== POD_NAME || !req?.body?.cmd || !remoteCmds[req?.body?.cmd] || !BOT_READY){
      res.sendStatus(400)
      return
    }
    let response = await remoteCmds[req.body.cmd](req.body, bot)
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


const startBot = async( data )=>{
  if(data?.numShards >= 0) NUM_SHARDS = data.numShards
  if(!POD_NAME) throw('POD_NAME not supplied...')
  if(SHARD_NUM >= 0 && NUM_SHARDS && BOT_TOKEN && NUM_SHARDS > SHARD_NUM){
    createBot()
    return true
  }
}

const createBot = ()=>{
  log.info(`Creating bot client on shard ${SHARD_NUM} of ${NUM_SHARDS} totalShards...`)
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
  bot.on('interactionCreate', interaction => {
    processCmds(interaction)
  });
  bot.on('guildMemberAdd', member => {
     botCmds(member, 'addMember', bot)
  })
  bot.on('guildMemberRemove', member => {
    botCmds(member, 'removeMember', bot)
  })
  bot.on('ready', async()=>{
    BOT_READY = true;
    log.info('bot-'+SHARD_NUM+' has started in '+bot.guilds.cache.size+' guilds')
  });
  bot.on('messageCreate', (msg) =>{
    if(msg.author.bot) return
    botCmds(msg, 'messageCreate', bot)
  })
  bot.on('messageDelete', (msg)=>{
    botCmds(msg, 'messageDelete', bot)
  })
  bot.on('messageReactionAdd', (reaction, usr)=>{
    if(usr.bot) return
    botCmds({ reaction: reaction, usr: usr }, 'messageReactionAdd', bot)
  })
  bot.on('messageUpdate', (oldMsg, newMsg)=>{
    if(newMsg.author.bot || oldMsg.author.bot) return
    botCmds({oldMsg: oldMsg, newMsg: newMsg}, 'messageUpdate', bot)
  })
  bot.on('error', (err)=>{
    log.error(err)
  })
  bot.login(BOT_TOKEN)
}
const recreateBot = async()=>{
  if(NUM_SHARDS >= 0){
    if(bot){
      BOT_READY = false
      await bot?.destroy()
      bot = null
    }
    startBot()
  }
}
module.exports.recreateBot = (data = {})=>{
  try{
    if(data.replicas && data.replicas !== NUM_SHARDS && data.name === SET_NAME && data.namespace === NAME_SPACE){
      let oldCount = NUM_SHARDS
      NUM_SHARDS = +data.replicas
      log.info(`Number of bot shards changed from ${oldCount} to ${NUM_SHARDS}. Recreating bot...`)
      recreateBot()
    }
  }catch(e){
    log.error(e)
  }
}
module.exports.startBot = startBot
