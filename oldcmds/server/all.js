'use strict'
module.exports = async(obj, opt)=>{
  try{
    let msg2send = {content: 'Error getting bot guilds'}
    const tempObj = await HP.BotRequest('getServerStats', {podName: 'all'})
    if(tempObj && tempObj.length > 0){
      let guildCount = 0, userCount = 0
    for(let i in tempObj){
      if(tempObj[i].guilds) guildCount += +tempObj[i].guilds
      if(tempObj[i].users) userCount += +tempObj[i].users
    }
      const embedMsg = {
        color: 15844367,
        title: 'C3PO Bot Stats',
        fields:[]
      }
      embedMsg.fields.push({
        name: 'Basic',
        value: '```\nServer Count : '+guildCount+'\nUser Count   : '+userCount+'\n```\n'
      })
      const servers = await mongo.count('discordServer', {})
      const privateServers = await mongo.count('discordServer', {instance: 'private'})
      const basicServers = await mongo.count('discordServer', {basicStatus: 0})
      const guilds = await mongo.count('guilds', {})
      const discordUsers = await mongo.count('discordId', {})
      const google = await mongo.count('tokens', {})
      const fb = await mongo.count('facebook', {})
      const shards = await mongo.count('payoutServers', {})
      const shardPlayers = await mongo.count('shardPlayers', {})
      const patreon = await mongo.count('patreon', {})
      const cr = await mongo.count('customReactions', {})
      const tempSvr = {
        name: "Servers",
        value: '```\n'
      }
      tempSvr.value += 'Registered : '+(servers || 0)+'\n'
      tempSvr.value += 'private    : '+(privateServers || 0)+'\n'
      tempSvr.value += 'Basic      : '+(basicServers || 0)+'\n'
      tempSvr.value += 'Guilds     : '+(guilds || 0)+'\n'
      tempSvr.value += '```'
      embedMsg.fields.push(tempSvr)
      const tempUsr = {
        name: 'Users',
        value: '```\n'
      }
      tempUsr.value += 'Users      : '+(discordUsers || 0)+'\n'
      tempUsr.value += 'Google     : '+(google || 0)+'\n'
      tempUsr.value += 'FB         : '+(fb || 0)+'\n'
      tempUsr.value += '```'
      embedMsg.fields.push(tempUsr)
      const tempPat = {
        name: 'Patreon',
        value: '```\n'
      }
      tempPat.value += 'Arena      : '+(patreon || 0)+'\n'
      tempPat.value += 'PO Shard   : '+(shards || 0)+'\n'
      tempPat.value += 'PO Players : '+(shardPlayers || 0)+'\n'
      tempPat.value += '```'
      embedMsg.fields.push(tempPat)
      const tempMisc = {
        name: 'Misc',
        value: '```\n'
      }
      tempMisc.value += 'CR         : '+(cr || 0)+'\n'
      tempMisc.value += '```'
      embedMsg.fields.push(tempMisc)
      msg2send.content = null
      msg2send.embeds = [embedMsg]
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
