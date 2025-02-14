'use strict'
module.exports = async(obj)=>{

  let roles = obj?.guild?.roles?.cache?.map(x=>{
    return {
      id: x.id,
      name: x.name,
      count: x.members?.size,
      perms: x.permissions?.toArray()
    }
  })
  let adminRoles = roles.filter(x=>x.perms.some(p=>p == 'ADMINISTRATOR' || p == 'Administrator'))
  let tempAdmin = adminRoles.map(x=>x.id)
  let manageRoles = roles.filter(x=>x.perms.some(p=>p == 'MANAGE_GUILD' || p == 'ManageGuild'))
  manageRoles = manageRoles.filter(x=> !tempAdmin.includes(x.id))
  let iconURL = obj?.guild?.iconURL({format: 'png', dynamic: true, size: 256})
  let embedMsg = { color: 15844367, author: { name: obj.guild.name, icon_url: iconURL }, thumbnail:{ url: iconURL }, footer: { text: `ID: ${obj.guild.id}` }, fields:[], timestamp: (new Date()) }
  let adminField = { name: 'Admin Roles', value: '' }
  if(adminRoles.length > 0){
    adminField.name += ' ('+adminRoles.length+')'
    for(let i in adminRoles) adminField.value += '<@&'+adminRoles[i].id+'> ('+adminRoles[i].count+')\n'
  }else{
    adminField.name += ' (0)'
    adminField.value = 'No roles with **Administrator** rights'
  }
  embedMsg.fields.push(adminField)
  let manageField = { name: 'Manage Server', value: '' }
  if(manageRoles.length > 0){
    manageField.name += ' ('+manageRoles.length+')'
    for(let i in manageRoles) manageField.value += '<@&'+manageRoles[i].id+'> ('+manageRoles[i].count+')\n'
  }else{
    manageField.name += ' (0)'
    manageField.value = 'No roles with **Manage Server** rights'
  }
  embedMsg.fields.push(manageField)
  return { content: null, embeds: [embedMsg] }
}
