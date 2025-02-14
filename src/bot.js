'use strict'
const log = require('logger')
const { Client, GatewayIntentBits } = require('discord.js');

const processAutoComplete = require('./processAutoComplete')

const msgCmd = require('./msgCmd');
const localCmd = require('./localCmd')
const modalCmd = require('./modalCmd')
const workerCmd = require('./workerCmd');

const BOT_TOKEN = process.env.BOT_TOKEN, POD_NAME = process.env.POD_NAME || 'bot', SHARD_NUM = +(process.env.POD_INDEX || 0), NUM_SHARDS = +(process.env.NUM_SHARDS || 1)

log.info(`Creating bot client on shard ${SHARD_NUM} of ${NUM_SHARDS} totalShards...`)

const checkInteraction = async(interaction)=>{
  try{
    if(!interaction?.id) return
    if(interaction.isAutocomplete()){
      processAutoComplete(interaction)
      return
    }
    if(interaction.type === 2 && !interaction.deferred && !interaction.replied) await interaction.deferReply()

    let opt = interaction.customId
    if(opt) opt = JSON.parse(opt)
    let command = interaction.commandName || opt.cmd

    if(modalCmd[command] && interaction.type > 2){
      if(opt?.dId && opt?.dId !== interaction.member?.user?.id) return
      modalCmd[command](interaction, opt)
      return
    }
    if(interaction.type > 2 && !interaction.deferred && !interaction.replied) await interaction.deferUpdate()

    if(localCmd[command]){
      localCmd.sendCmd(command, interaction, opt)
      return
    }


    workerCmd(interaction, opt)
  }catch(e){
    log.error(e)
  }
}

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
let bot = new Client(botOpts);

bot.on('interactionCreate', interaction => {
  checkInteraction(interaction)
});
bot.on('messageCreate', (msg) =>{
  if(msg?.author?.bot || !msg?.content) return
  msgCmd(msg)
})
/*
bot.on('guildMemberAdd', member => {
   //botCmds(member, 'addMember', bot)
})
bot.on('guildMemberRemove', member => {
  //botCmds(member, 'removeMember', bot)
})
bot.on('ready', async()=>{
  log.info(`${POD_NAME} has started in ${bot.guilds.cache.size} guilds`)
});
*/

/*
bot.on('messageDelete', (msg)=>{
  //botCmds(msg, 'messageDelete', bot)
})

bot.on('messageReactionAdd', (reaction, usr)=>{
  if(usr.bot) return
  //botCmds({ reaction: reaction, usr: usr }, 'messageReactionAdd', bot)
})
bot.on('messageUpdate', (oldMsg, newMsg)=>{
  if(newMsg.author.bot || oldMsg.author.bot) return
  //botCmds({oldMsg: oldMsg, newMsg: newMsg}, 'messageUpdate', bot)
})
*/
bot.on('error', (err)=>{
  log.error(err)
})
bot.podName = POD_NAME

module.exports = bot
