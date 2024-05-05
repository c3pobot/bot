'use strict'
const cmdToJson = require('src/helpers/cmdToJson')
const cmdQue = require('src/cmdQue')
const { cmdMap } = require('src/helpers/cmdMap')

const getJobType = (obj = {})=>{
  if(cmdMap[obj.commandName]) return cmdMap[obj.commandName].worker
  if(cmdMap[obj.data?.name]) return cmdMap[obj.data?.name].worker
}
module.exports = async(interaction) =>{
  let intialResponse = 'Oh dear! Unspecified Error Occured...', status
  if(!interaction?.guildId){
    interaction.reply({ content: 'Oh dear! I don\'t work very well in DM\'s'})
    return;
  }
  let type = getJobType(interaction)
  if(type){
    intialResponse = 'Here we go again...'
    let cmdData = cmdToJson(interaction)
    if(cmdData?.id) status = await cmdQue.add(type, cmdData)
    if(!status) intialResponse = 'Oh dear! error adding command to the que'
  }else{
    intialResponse = 'Oh dear! Command not recognized...'
  }
  interaction.reply({ content: intialResponse })
}
