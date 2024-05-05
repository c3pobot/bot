'use strict'
const redis = require('redisclient')
const cmdQue = require('src/cmdQue')
const cmdToJson = require('src/helpers/cmdToJson')

const { cmdMap } = require('src/helpers/cmdMap')

const getJobType = (obj = {})=>{
  if(cmdMap[obj.commandName]) return cmdMap[obj.commandName].worker
  if(cmdMap[obj.data?.name]) return cmdMap[obj.data?.name].worker
}
const addButtonJob = async(obj = {})=>{
  let type = getJobType(obj)
  await redis.del(obj.id)
  await redis.del('button-'+obj.id)
  if(type) cmdQue.add(type, obj)
}
const addMiscJob = (interaction)=>{
  let type = getJobType(interaction)
  let cmdData = cmdToJson(interaction)
  if(type) cmdQue.add(type, cmdData)
}
const miscCmds = ['pollvote']
module.exports = async(interaction = {})=>{
  if(!interaction.customId || !interaction.user?.id){
    interaction.deferUpdate()
    return;
  }
  let opt = JSON.parse(interaction.customId)
  if(!opt?.id){
    interaction.deferUpdate()
    return;
  }
  if(opt?.type && miscCmds.filter(x=>x == opt?.type).length > 0){
    req.data.name = opt.type
    addMiscJob(interaction)
    interaction.update({ components: []})
    return;
  }
  let tempObj = await redis.get('button-'+opt.id)
  if(!tempObj) tempObj = await redis.get(opt.id)
  if(!tempObj?.member?.user?.id){
    interaction.update({ content: 'Command timed out', components: []});
    return;
  }
  if(tempObj.member.user.id == interaction.user?.id){
    tempObj.token = interaction.token
    tempObj.jobId = interaction.token
    tempObj.timestamp = interaction.createdTimestamp
    tempObj.confirm = opt
    addButtonJob(tempObj)
    interaction.update({ components: []});
    return;
  }
  interaction.deferUpdate()
}
