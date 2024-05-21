'use strict'
const log = require('logger')
const mongo = require('mongoclient')
const cmdToJson = require('src/helpers/cmdToJson')
const cmdQue = require('src/cmdQue')
const { cmdMap } = require('src/helpers/cmdMap')
const getCmdOptions = async(obj)=>{
  try{
    let opt = (await mongo.find('cmdOptionsCache', { _id: obj.confirm?.id }))[0]
    if(opt) mongo.del('cmdOptionsCache', { _id: opt._id })
    if(!opt?.updated) return
    if(Date.now() > (opt.updated + (60 * 60 * 1000))) return
    obj.cmd = opt.cmd, obj.subCmd = opt.subCmd, obj.subCmdGroup = opt.subCmdGroup, obj.data.options = {...opt.options, ...obj.data.options}
  }catch(e){
    log.error(e)
  }
}
module.exports = async(interaction)=>{
  try{
    if(!interaction?.guildId){
      interaction.reply({ content: 'Oh dear! I don\'t work very well in DM\'s', components: []})
      return;
    }
    //await interaction.reply({ content: 'Here we go again...', components: [] })
    if(interaction.type > 2) await interaction.deferUpdate()
    //if(interaction.type == 2) await interaction.deferReply()
    if(interaction.type == 2) await interaction.reply({ content: 'Here we go again...', components: [] })
    let cmdData = cmdToJson(interaction)
    if(!cmdData?.id){
      await interaction.editReply({ content: 'Oh dear! error getting command data...', components: [] })
      return
    }
    if(interaction.type > 2 && cmdData.confirm?.dId && cmdData.confirm?.dId !== interaction.member?.user?.id) return
    if(interaction.type > 2) await interaction.editReply({ content: 'Here we go again...', components: [] })
    if(cmdData.type > 2 && cmdData.confirm?.id){
      await getCmdOptions(cmdData)
      if(!cmdData.cmd){
        interaction.editReply({ content: 'command timed out...', components: [] })
        return
      }
    }

    let type = cmdMap[cmdData.cmd]?.worker
    if(!type){
      await interaction.editReply({ content: 'Oh dear! Command not recognized...', components: [] })
      return
    }

    let status = await cmdQue.add(type, cmdData)
    if(status) return
    interaction.editReply({ content: 'Oh dear! error adding command to the que', components: [] })
  }catch(e){
    log.error(e)
  }
}
