'use strict'
const TimeDate = (timestamp)=>{
  try{
    if(timestamp) return ((new Date(timestamp))?.toLocaleString('en-US', {timeZone: 'America/New_York'}))
  }catch(e){
    console.error(e);
  }
}
module.exports = async(obj)=>{
  try{
    let msg2Send = {content: 'Error getting guild info'}
    const tempObj = {
      sId: obj.guild_id
    }
    const guild = await HP.BotRequest('getGuild', tempObj)
    if(guild){
      const embedMsg = {
        color: 15844367,
        author:{
          name: guild.name,
          icon_url: guild.iconURL
        },
        thumbnail:{
          url: guild.iconURL
        },
        footer:{
          text: 'ID: '+guild.id
        },
        fields:[],
        timestamp: (new Date())
      }
      if(guild.ownerId) embedMsg.fields.push({
        name: 'Owner',
        value: '<@'+guild.ownerId+'>',
        inline: true
      })
      embedMsg.fields.push({
        name: 'Members',
        value: (guild.memberCount || 0),
        inline: true
      })
      embedMsg.fields.push({
        name: 'Channel Categories',
        value: guild.gChannels.filter(x=>x.type == 4).length,
        inline: true
      })
      embedMsg.fields.push({
        name: 'Text Channels',
        value: guild.gChannels.filter(x=>x.type == 0).length,
        inline: true
      })
      embedMsg.fields.push({
        name: 'Voice Channels',
        value: guild.gChannels.filter(x=>x.type == 2).length,
        inline: true
      })
      embedMsg.fields.push({
        name: 'Roles',
        value: guild.gRoles.filter(x=>x.name != '@everyone').length,
        inline: true
      })
      embedMsg.fields.push({
        name: 'Created',
        value: TimeDate(+guild.createdTimestamp),
        inline: true
      })
      if(guild.joinedTimestamp){
        embedMsg.fields.push({
          name: 'Joined',
          value: TimeDate(+guild.joinedTimestamp),
          inline: false
        })
      }
      msg2Send.content = null
      msg2Send.embeds = [embedMsg]
    }
    HP.ReplyMsg(obj, msg2Send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
