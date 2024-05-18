'use strict'
const timeDate = (timestamp)=>{
  if(timestamp) return ((new Date(timestamp))?.toLocaleString('en-US', {timeZone: 'America/New_York'}))
}
const enumPerms = require('./enumPerms')
module.exports = async(obj)=>{
  let usr = obj?.options?.get('user')?.member || obj.member
  let usrname = usr?.member?.nickname || usr?.member?.user?.username
  let avatarURL = usr?.avatarURL({format: 'png', dynamic: true, size: 256 }) || usr?.user?.avatarURL({format: 'png', dynamic: true, size: 256 })
  let embedMsg = { color: 15844367, author: { name: usr.user.tag, icon_url: avatarURL }, thumbnail:{ url: avatarURL }, footer:{ text: `ID: ${usr.id}` }, fields:[], timestamp: (new Date()) }

  embedMsg.fields.push({ name: 'Joined', value: timeDate(+usr.joinedTimestamp), inline: true })
  embedMsg.fields.push({ name: 'Registered', value: timeDate(+usr.user.createdTimestamp), inline: true })
  let roles = usr.roles?.cache?.map(x=>{ return { id: x.id, name: x.name } })?.filter(x=>x.name !== '@everyone')

  if(roles.length > 0){
    let roleField = { name: 'Roles ('+roles.length+')', value: '' }
    for(let i in roles) roleField.value += '<@&'+roles[i].id+'> '
    embedMsg.fields.push(roleField)
  }
  let perms = usr?.permissions.toArray() || []
  if(perms.length > 0){
    let tempObj = { name: 'Key Permissions' }
    for(let i in perms){
      if(!enumPerms[perms[i]]) continue
      if(!tempObj.value){
        tempObj.value = enumPerms[perms[i]]
      }else{
        tempObj.value += ', '+enumPerms[perms[i]]
      }
    }
    if(tempObj?.value) embedMsg.fields.push(tempObj)
  }
  if(perms.filter(x=>x == 'Administrator').length > 0 || (obj?.guild?.ownerId && obj.guild.ownerId == usr.user.id)){
    let tempObj = { name: 'Acknowledgements' }
    if(obj?.guild?.ownerId == usr.user.id){
      tempObj.value = 'Server Owner'
    }else{
      tempObj.value = 'Server Admin'
    }
    embedMsg.fields.push(tempObj)
  }
  return { content: null, embeds: [embedMsg]}
}
