'use strict'
const log = require('logger')
const redis = require('redisclient')
const getJobType = require('./getJobType')
const CmdToJSON = require('helpers/cmdToJson')
const CmdQue = require('cmdQue')
const AddButtonJob = async(obj = {}, jobId)=>{
  try{
    const type = await getJobType(obj)
    await redis.del(obj.id)
    await redis.del('button-'+obj.id)
    if(type) CmdQue.add(type, obj, jobId)
  }catch(e){
    log.error(e)
  }
}
const AddMiscJob = async(interaction)=>{
  try{
    let type = await getJobType(interaction)
    let cmdData = CmdToJSON(interaction)
    if(type) CmdQue.add(type, cmdData)
  }catch(e){
    log.error(e)
  }
}
const miscCmds = ['pollvote']
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
    if(opt?.type && miscCmds.filter(x=>x == opt?.type).length > 0){
      req.data.name = opt.type
      AddMiscJob(interaction)
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
      tempObj.confirm = opt
      AddButtonJob(tempObj, interaction?.id)
      interaction.update({ components: []});
      return;
    }
    interaction.deferUpdate()
  }catch(e){
    log.error(e)
  }
}
