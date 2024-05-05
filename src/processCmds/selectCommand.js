'use strict'
const redis = require('redisclient')
const cmdQue = require('src/cmdQue')
const { cmdMap } = require('src/helpers/cmdMap')
const getJobType = (obj = {})=>{
  if(cmdMap[obj.commandName]) return cmdMap[obj.commandName].worker
  if(cmdMap[obj.data?.name]) return cmdMap[obj.data?.name].worker
}
const addJob = async(obj = {})=>{
  let type = getJobType(obj)
  if(!type) return
  await redis.del(obj.id)
  await redis.del(`button-${obj.id}`)
  await cmdQue.add(type, obj)
}
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
  let tempObj = await redis.get('component-'+opt.id)
  if(!tempObj) tempObj = await redis.get(opt.id)
  if(!tempObj?.member?.user?.id){
    interaction.update({ content: 'Command timed out', components: []});
    return;
  }
  if(tempObj.member.user.id == interaction.user?.id){
    tempObj.token = interaction.token
    tempObj.timestamp = interaction.createdTimestamp
    tempObj.select = { opt: opt, data: interaction.values || [] }
    await addJob(tempObj)
    interaction.update({ components: []});
    return;
  }
  interaction.deferUpdate()
}
