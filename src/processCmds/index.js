'use strict'
const log = require('logger')
const autoComplete = require('./autoComplete')
const remoteCmd = require('./remoteCmd')
const { localCmds, sendCmd } = require('src/cmds')

module.exports = (interaction)=>{
  try{
    if(!interaction) return
    if(interaction.isAutocomplete()){
      autoComplete(interaction)
      return
    }
    let opt = interaction.customId
    if(opt) opt = JSON.parse(opt)
    let command = interaction.commandName || opt.cmd
    if(!interaction) return
    if(command && localCmds[command]){
      sendCmd(command, interaction, opt)
      return
    }
    remoteCmd(interaction)
  }catch(e){
    log.error(e)
  }
}
