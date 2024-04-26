'use strict'
const fs = require('fs')
const log = require('logger')
const mongo = require('mongoclient')
const cmdToJson = require('helpers/cmdToJson')
const cmdQue = require('cmdQue')
const getJobType = require('helpers/getJobType')
const fixJson = (interaction)=>{
  let data = interaction?.toJSON()
  let json = JSON.stringify(interaction, (key, value)=>{
    typeof value === 'bigint'
                ? value.toString()
                : value // return everything else unchanged
  })
  log.info(json)
  //mongo.set('tempCmd', { _id: interaction.id }, { data: json })
}
module.exports = async(interaction) =>{
  try{
    fixJson(interaction)


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
