'use strict'
const CLIENT_ID = process.env.DISCORD_CLIENT_ID
module.exports = async(obj)=>{
  try{
    let msg2send = {content: "Error getting SlashCmds from DB"}, cmdObj = {}
    const payload = {}
    if(process.env.PRIVATE_BOT){
      msg2send.content = "Only globalCmds for the private bot"
    }else{
      const slashCmds = await mongo.find('slashCmds', {})
      if(slashCmds.length == 0) msg2send.content = 'There are no slashCmds saved in the database'
      if(process.env.PRIVATE_BOT){
        if(process.env.IS_TEST_BOT){
          for(let i in slashCmds){
            if(!cmdObj.public) cmdObj.public = {type: 'public', cmds: []}
            let publicCmds = slashCmds[i].cmds.filter(x=>x.type && x.type.includes('public')).map(c=>c.cmd)
            if(cmdObj?.public?.cmds && publicCmds?.length > 0) cmdObj.public.cmds = cmdObj.public.cmds.concat(publicCmds)
          }
          if(obj?.guild_id && cmdObj?.public?.cmds?.length > 0) await MSG.AddGuildCmd(obj.guild_id, cmdObj.public.cmds, 'PUT')
          msg2send.content = 'Added only discord commmands for the test bot'
        }else{
          msg2send.content = 'There is only global cmds for private bot'
        }
      }else{
        //const slashCmds = await mongo.find('slashCmds', {})
        //if(slashCmds.length == 0) msg2send.content = 'There are no slashCmds saved in the database'
        if(slashCmds.length > 0){
          for(let i in slashCmds){
            let tempCmds = slashCmds[i].cmds.filter(x=>x.type && !x.hidden && !x.type.includes('public'))
            if(tempCmds?.length > 0){
              for(let c in tempCmds){
                if(!cmdObj[tempCmds[c].type]){
                  cmdObj[tempCmds[c].type] = {type: tempCmds[c].type, cmds: []}
                }
                if(cmdObj[tempCmds[c].type]) cmdObj[tempCmds[c].type].cmds.push(tempCmds[c].cmd)
              }
            }
            if(process.env.IS_TEST_BOT){
              if(!cmdObj.public) cmdObj.public = {type: 'public', cmds: []}
              let publicCmds = slashCmds[i].cmds.filter(x=>x.type && x.type.includes('public')).map(c=>c.cmd)
              if(cmdObj?.public?.cmds && publicCmds?.length > 0) cmdObj.public.cmds = cmdObj.public.cmds.concat(publicCmds)
            }
          }
          const guilds = await mongo.find('discordServer', {basicStatus: 1}, {_id: 1, admin: 1, ignore: 1})
          const payouts = await mongo.find('payoutServers', {status: 1}, {admin:1, patreonId:1, sId: 1})
          let gCount = 0, sCount = 0, gDeferedCount = 0, sDeferedCount = 0
          for(let i in guilds){
            if(guilds[i].ignore) continue
            let guildCmds = JSON.parse(JSON.stringify(cmdObj.private.cmds))
            if(process.env.IS_TEST_BOT && guilds[i]._id == botSettings.botSID) guildCmds = guildCmds.concat(JSON.parse(JSON.stringify(cmdObj.public.cmds)))
            if(payouts?.filter(x=>x.sId == guilds[i]._id).length > 0) guildCmds = guildCmds.concat(JSON.parse(JSON.stringify(cmdObj.shard.cmds)))
            if(botSettings?.homeSVR?.filter(x=>x == guilds[i]._id).length > 0) guildCmds = guildCmds.concat(JSON.parse(JSON.stringify(cmdObj['home-guild'].cmds)))
            if(botSettings?.boSVR?.filter(x=>x == guilds[i]._id).length > 0){
              guildCmds = guildCmds.concat(JSON.parse(JSON.stringify(cmdObj['bo-private'].cmds)))
              guildCmds = guildCmds.concat(JSON.parse(JSON.stringify(cmdObj['bo-home'].cmds)))
            }
            if(guildCmds?.length > 0){
              if(guilds[i]._id === botSettings?.botSID){
                await MSG.AddGuildCmd(guilds[i]._id, guildCmds, 'PUT')
                gCount++;
              }else{
                await mongo.set('commandUpdates', {_id: guilds[i]._id}, { data: guildCmds, type: 'guild', dId: obj.member.user.id, chId: obj.channel_id, sId: obj.guild_id, botId: CLIENT_ID })
                ++gDeferedCount
              }
            }
          }
          for(let i in payouts){
            if(guilds.filter(x=>x._id == payouts[i].sId).length == 0){
              let shardCmds = JSON.parse(JSON.stringify(cmdObj.shard.cmds))
              if(shardCmds?.length > 0){
                if(payouts[i].sId === botSettings?.map?.botSID){
                  await MSG.AddGuildCmd(payouts[i].sId, shardCmds, 'PUT')
                  sCount++;
                }else{
                  await mongo.set('commandUpdates', {_id: payouts[i].sId}, { data: shardCmds, type: 'shard', dId: obj.member.user.id, chId: obj.channel_id, sId: obj.guild_id, botId: CLIENT_ID })
                  ++sDeferedCount
                }
              }
            }
          }
          msg2send.content = 'Updated '+gCount+' guild commands and '+sCount+' shard commands. Deferred '+gDeferedCount+' guild commands and '+sDeferedCount+' shard commands...'
        }
      }
    }
    HP.ReplyMsg(obj, msg2send)
  }catch(e){
    HP.ReplyError(obj)
    console.error(e);
  }
}
