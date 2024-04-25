'use strict'
const log = require('logger')
const redis = require('redisclient')
const cmdQue = require('cmdQue')
const { CmdMap } = require('helpers/cmdMap')
const addJob = async(obj = {})=>{
  let type
  if(CmdMap?.map[obj?.data?.name]) type = CmdMap?.map[obj?.data?.name].worker
  if(!type) return
  await redis.del(obj.id)
  await redis.del(`button-${obj.id}`)
  await cmdQue.add(type, obj)
}
module.exports = async(interaction = {})=>{
  try{
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
    return;
  }catch(e){
    log.error(e)
  }
}
