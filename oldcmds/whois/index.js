'use strict'
//const { Permissions } = require('discord.js');
const TimeDate = (timestamp)=>{
  try{
    if(timestamp) return ((new Date(timestamp))?.toLocaleString('en-US', {timeZone: 'America/New_York'}))
  }catch(e){
    console.error(e);
  }
}
module.exports = async(obj)=>{
  try{
    let dId = obj.member.user.id, msg2Send = {content: 'Error getting user info'}, username = (obj.member.nick ? obj.member.nick:obj.member.user.username), perm = +obj.member.permissions
    if(obj.data.options && obj.data.options.find(x=>x.name == 'user')){
      dId = obj.data.options.find(x=>x.name == 'user').value
      if(obj.data.resolved && obj.data.resolved.members && obj.data.resolved.members[dId] && obj.data.resolved.users && obj.data.resolved.users[dId]){
        perm = +obj.data.resolved.members[dId].permissions
        username = (obj.data.resolved.members[dId].nick ? obj.data.resolved.members[dId].nick:obj.data.resolved.users[dId].username)
      }
    }
    const tempObj = {
      dId: dId,
      sId: obj.guild_id
    }
    const usr = await HP.BotRequest('getGuildMember', tempObj)
    if(usr && usr.user){
      const embedMsg = {
        color: 15844367,
        author:{
          name: usr.user.tag,
          icon_url: usr.user.avatarURL
        },
        thumbnail:{
          url: usr.user.avatarURL
        },
        footer:{
          text: 'ID: '+dId
        },
        fields:[],
        timestamp: (new Date())
      }

      embedMsg.fields.push({
        name: 'Joined',
        value: TimeDate(+usr.joinedTimestamp),
        inline: true
      })
      embedMsg.fields.push({
        name: 'Registered',
        value: TimeDate(+usr.user.createdTimestamp),
        inline: true
      })
      const roles = usr.roles.filter(x=>x.name != '@everyone')
      if(roles.length > 0){
        const roleField = {
          name: 'Roles ('+roles.length+')',
          value: ''
        }
        for(let i in roles) roleField.value += '<@&'+roles[i].id+'> '
        embedMsg.fields.push(roleField)
      }
      if(usr.perms.length > 0){
        const tempObj = {
          name: 'Key Permissions'
        }
        for(let i in usr.perms){
          if(HP.EnumPerms[usr.perms[i]]){
            if(!tempObj.value){
              tempObj.value = HP.EnumPerms[usr.perms[i]]
            }else{
              tempObj.value += ', '+HP.EnumPerms[usr.perms[i]]
            }
          }
        }
        if(tempObj?.value) embedMsg.fields.push(tempObj)
      }
      if(usr.perms.filter(x=>x == 'Administrator').length > 0 || (usr.guildOwnerID && usr.guildOwnerID == usr.user.id)){
        const tempObj = {
          name: 'Acknowledgements'
        }
        if(usr?.guildOwnerID == usr.user.id){
          tempObj.value = 'Server Owner'
        }else{
          tempObj.value = 'Server Admin'
        }
        embedMsg.fields.push(tempObj)
      }
      msg2Send.content = null,
      msg2Send.embeds = [embedMsg]
    }
    HP.ReplyMsg(obj, msg2Send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
