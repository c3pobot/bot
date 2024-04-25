'use strict'
const log = require('logger')
const mongo = require('mongoapiclient')
const cmdToJson = require('helpers/cmdToJson')
const cmdQue = require('cmdQue')
const getJobType = require('helpers/getJobType')
module.exports = async(interaction) =>{
  try{
    let intialResponse = 'Oh dear! Unspecified Error Occured...', status
    if(!interaction?.guildId){
      interaction.reply({ content: 'Oh dear! I don\'t work very well in DM\'s'})
      return;
    }
    let type = await getJobType(interaction)
    if(type){
      intialResponse = 'Here we go again...'
      let cmdData = cmdToJson(interaction)
      if(cmdData?.id) status = await cmdQue.add(type, cmdData)
      if(!status) intialResponse = 'Oh dear! error adding command to the que'
    }else{
      intialResponse = 'Oh dear! Command not recognized...'
    }
    interaction.reply({ content: intialResponse })
  }catch(e){
    log.error(e)
    interaction?.reply({ content: 'Unspecified error occured.'})
  }
}
