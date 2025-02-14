'use strict'
const log = require('logger')
const mongo = require('mongoclient')

const cmdToJson = require('./cmdToJson')
const { cmdMap } = require('../cmdMap')
const rabbitmq = require('../rabbitmq');
const deferOnly = new Set(['unit-approve', 'unit-vote'])
const getCmdOptions = async(obj)=>{
  try{
    let opt = (await mongo.find('cmdOptionsCache', { _id: obj.confirm?.id }))[0]
    //if(opt) mongo.del('cmdOptionsCache', { _id: opt._id })
    if(!opt?.updated) return
    if(Date.now() > (opt.updated + (60 * 60 * 1000))) return
    obj.cmd = opt.cmd, obj.subCmd = opt.subCmd, obj.subCmdGroup = opt.subCmdGroup, obj.data.options = {...opt.options, ...obj.data.options}
  }catch(e){
    log.error(e)
  }
}
const cleanCache = async(id)=>{
  try{
    if(id) await mongo.del('cmdOptionsCache', { _id: id} )
  }catch(e){
    log.error(e)
  }
}

module.exports = async(interaction)=>{
  try{
    if(!interaction?.guildId){
      interaction.editReply({ content: 'Oh dear! I don\'t work very well in DM\'s', components: []})
      return;
    }
    //await interaction.reply({ content: 'Here we go again...', components: [] })
    //if(interaction.type == 2) await interaction.deferReply()
    if(interaction.type == 2) await interaction.editReply({ content: 'Here we go again...', components: [] })
    let cmdData = await cmdToJson(interaction)
    if(!cmdData?.id){
      await interaction.editReply({ content: 'Oh dear! error getting command data...', components: [] })
      return
    }
    if(interaction.type > 2 && cmdData.confirm?.dId && cmdData.confirm?.dId !== interaction.member?.user?.id) return
    if(cmdData.type > 2 && cmdData.confirm?.id){
      await getCmdOptions(cmdData)
      if(!cmdData.cmd){
        if(cmdData.confirm?.user) return
        interaction.editReply({ content: 'command timed out...', components: [] })
        return
      }
      if(cmdData.confirm?.user && cmdData.data.options?.author?.value !== interaction.member?.user?.id) return
    }
    if(interaction.type > 2 && !deferOnly.has(cmdData.cmd)) await interaction.editReply({ content: 'Here we go again...', components: [] })
    let type = cmdMap[cmdData.cmd]?.worker
    if(!type){
      await interaction.editReply({ content: 'Oh dear! Command not recognized...', components: [] })
      return
    }
    cleanCache(cmdData?.confirm?.id)
    let status = await rabbitmq.add(type, cmdData)
    if(status) return
    interaction.editReply({ content: 'Oh dear! error adding command to the que', components: [] })
  }catch(e){
    log.error(e)
  }
}
