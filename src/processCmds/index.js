'use strict'
const AutoComplete = require('./autoComplete')
const ChatCommand = require('./chatCommand')
const ButtonCommand = require('./buttonCommand')
const SelectCommand = require('./selectCommand')
module.exports = (interaction)=>{
  if(interaction.isAutocomplete()) AutoComplete(interaction)
  if(interaction.isButton()) ButtonCommand(interaction)
  if(interaction.isCommand()) ChatCommand(interaction)
  if(interaction.isStringSelectMenu()) SelectCommand(interaction)
  return;
}
