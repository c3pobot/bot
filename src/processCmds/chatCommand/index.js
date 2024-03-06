'use strict'
const log = require('logger')
const mongo = require('mongoapiclient')
const CmdToJSON = require('helpers/cmdToJson')
const CmdQue = require('cmdQue')
const getJobType = require('helpers/getJobType')
module.exports = async(interaction) =>{
  try{
    let intialResponse = 'Oh dear! Unspecified Error Occured...'
    if(!interaction?.guildId){
      interaction.reply({ content: 'Oh dear! I don\'t work very well in DM\'s'})
      return;
    }
    let type = await getJobType(interaction)
    if(type){
      intialResponse = 'Here we go again...'
      let cmdData = CmdToJSON(interaction)
      let status = await CmdQue.add(type, cmdData)
      if(!status?.timestamp) intialResponse = 'Oh dear! error adding command to the que'
      mongo.set('interactions', {_id: cmdData.data.name}, cmdData)
    }else{
      intialResponse = 'Oh dear! Command not recognized...'
    }
    interaction.reply({content: intialResponse})

  }catch(e){
    log.error(e)
  }
}
