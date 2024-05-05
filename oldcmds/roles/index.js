'use strict'
module.exports = async(obj)=>{
  try{
    let msg2Send = {content: 'Error getting guild info'}
    const tempObj = {
      sId: obj.guild_id
    }
    const guild = await HP.BotRequest('getGuild', tempObj)
    if(guild){
      const adminRoles = guild.gRoles.filter(x=>x.perms.some(p=>p == 'ADMINISTRATOR' || p == 'Administrator'))
      const tempAdmin = adminRoles.map(x=>x.id)
      let manageRoles = guild.gRoles.filter(x=>x.perms.some(p=>p == 'MANAGE_GUILD' || p == 'ManageGuild'))
      manageRoles = manageRoles.filter(x=> !tempAdmin.includes(x.id))
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
      const adminField = {
        name: 'Admin Roles',
        value: ''
      }
      if(adminRoles.length > 0){
        adminField.name += ' ('+adminRoles.length+')'
        for(let i in adminRoles) adminField.value += '<@&'+adminRoles[i].id+'> ('+adminRoles[i].count+')\n'
      }else{
        adminField.name += ' (0)'
        adminField.value = 'No roles with **Administrator** rights'
      }
      embedMsg.fields.push(adminField)
      const manageField = {
        name: 'Manage Server',
        value: ''
      }
      if(manageRoles.length > 0){
        manageField.name += ' ('+manageRoles.length+')'
        for(let i in manageRoles) manageField.value += '<@&'+manageRoles[i].id+'> ('+manageRoles[i].count+')\n'
      }else{
        manageField.name += ' (0)'
        manageField.value = 'No roles with **Manage Server** rights'
      }
      embedMsg.fields.push(manageField)
      msg2Send.content = null
      msg2Send.embeds = [embedMsg]
    }
    HP.ReplyMsg(obj, msg2Send)
  }catch(e){
    console.log(e)
    HP.ReplyError(obj)
  }
}
