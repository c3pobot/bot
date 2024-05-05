'use strict'
module.exports = async(obj)=>{
  try{
    const guild = (await mongo.find('discordServer', {_id: obj.sId}))[0]
    if(obj && obj.user && guild && guild.memberLeave){
      const embedMsg = {
        color: 15844367,
        author: {
          name: 'Member Left',
          icon_url: obj.user.avatarURL
        },
        thumbnail: {
          url: obj.user.avatarURL
        },
        description: '<@'+obj.user.dId+'> '+obj.user.tag,
        footer:{
          text: 'ID: '+obj.user.dId
        },
        timestamp: new Date()
      }
      if(obj.user.roles && obj.user.roles.length > 0){
        embedMsg.description += '\nRoles\n'
        for(let i in obj.user.roles){
          if(obj.user.roles[i].name != '@everyone') embedMsg.description += '<@&'+obj.user.roles[i].id+'> '
        }
      }
      MSG.SendMsg({chId: guild.memberLeave}, {embed: embedMsg})
    }
  }catch(e){
    console.error(e)
  }
}
