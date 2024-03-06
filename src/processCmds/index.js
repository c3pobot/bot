'use strict'
const AutoComplete = require('./autoComplete')
const ChatCommand = require('./chatCommand')
const ButtonCommand = require('./buttonCommand')
module.exports = (interaction)=>{
  if(interaction.isAutocomplete()) AutoComplete(interaction)
  if(interaction.isButton()) ButtonCommand(interaction)
  if(interaction.isCommand()) ChatCommand(interaction)  
  return;
}
